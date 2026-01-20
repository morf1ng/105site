import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { fetchUsersFromApi, createUserOnApi, updateUserOnApi, deleteUserOnApi, fetchRolesFromApi, type ApiUser, type ApiRole } from '@/lib/api'

type UserDisplay = {
    id: number
    email: string
    fullName: string
    role: string
    createdAt: string
}

const UsersTable = () => {
    const [users, setUsers] = useState<UserDisplay[]>([])
    const [roles, setRoles] = useState<ApiRole[]>([])
    const [emailSearch, setEmailSearch] = useState('')
    const [nameSearch, setNameSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [newFullName, setNewFullName] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [roleSelectOpen, setRoleSelectOpen] = useState(false)
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [loading, setLoading] = useState(true)

    // Helper to convert ApiUser to UserDisplay
    const apiUserToDisplay = (apiUser: ApiUser, rolesMap: Map<number, string>): UserDisplay => {
        const roleNames = apiUser.role_ids
            ? apiUser.role_ids.split(',').map(id => {
                const roleId = parseInt(id.trim())
                return rolesMap.get(roleId) || `Role ${roleId}`
            }).join(', ')
            : 'Нет ролей'
        
        return {
            id: apiUser.id,
            email: apiUser.email,
            fullName: apiUser.fullname || '',
            role: roleNames,
            createdAt: apiUser.created_at 
                ? new Date(apiUser.created_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                : ''
        }
    }

    const loadRoles = async () => {
        try {
            const list = await fetchRolesFromApi()
            setRoles(list)
            return list
        } catch (e) {
            console.error('Не удалось загрузить роли из API', e)
            return []
        }
    }

    const loadUsers = async (rolesList: ApiRole[]) => {
        try {
            setLoading(true)
            const usersList = await fetchUsersFromApi()
            const rolesMap = new Map(rolesList.map(r => [r.id, r.name]))
            const displayUsers = usersList.map(user => apiUserToDisplay(user, rolesMap))
            setUsers(displayUsers)
        } catch (e) {
            console.error('Не удалось загрузить пользователей из API', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const load = async () => {
            const rolesList = await loadRoles()
            await loadUsers(rolesList)
        }
        void load()
    }, [])

    const filteredUsers = users.filter(user => {
        const matchesEmail = user.email.toLowerCase().includes(emailSearch.toLowerCase())
        const matchesName = user.fullName.toLowerCase().includes(nameSearch.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role.includes(roleFilter)
        return matchesEmail && matchesName && matchesRole
    })

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

    const handleReset = () => {
        setEmailSearch('')
        setNameSearch('')
        setRoleFilter('all')
        setCurrentPage(1)
    }

    const handleEdit = async (id: number) => {
        // TODO: Implement edit functionality (could open a modal similar to create)
        console.log('Edit user:', id)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            return
        }

        try {
            await deleteUserOnApi(id)
            const rolesList = await loadRoles()
            await loadUsers(rolesList)
        } catch (err) {
            console.error('Не удалось удалить пользователя', err)
            alert('Не удалось удалить пользователя')
        }
    }

    const uniqueRoles = Array.from(new Set(users.flatMap(user => user.role.split(', ').map(r => r.trim())))).filter(Boolean)

    const combinedSelectedRoleLabel =
        selectedRoleIds.length === 0
            ? 'Выберите роль'
            : selectedRoleIds.map(id => roles.find(r => r.id === id)?.name || `Role ${id}`).join(', ')

    const handleOpenCreate = () => {
        setNewEmail('')
        setNewFullName('')
        setNewPassword('')
        setSelectedRoleIds([])
        setIsCreateOpen(true)
    }

    const handleCloseCreate = () => {
        if (isSaving) return
        setIsCreateOpen(false)
        setRoleSelectOpen(false)
    }

    const toggleRole = (roleId: number) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        )
    }

    const handleCreateSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!newEmail.trim() || !newPassword.trim() || selectedRoleIds.length === 0) {
            return
        }

        try {
            setIsSaving(true)
            await createUserOnApi({
                email: newEmail.trim(),
                password: newPassword.trim(),
                fullname: newFullName.trim() || undefined,
                role_ids: selectedRoleIds.join(',')
            })
            setIsCreateOpen(false)
            setRoleSelectOpen(false)
            const rolesList = await loadRoles()
            await loadUsers(rolesList)
        } catch (err) {
            console.error('Не удалось создать пользователя', err)
            alert('Не удалось создать пользователя')
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="users__main-container">
                <div>Загрузка...</div>
            </div>
        )
    }

    return (
        <div className="users__main-container">
            <div className="users__header">
                <h1 className="users__page-title">Пользователи</h1>
                <button
                    className="users__create-button"
                    onClick={handleOpenCreate}
                >
                    Создать пользователя
                </button>
            </div>

            <div className="users__table-container">
                <div className="users__filters">
                    <div className="users__filter-group">
                        <input
                            type="text"
                            placeholder="example@gmail.ru"
                            className="users__filter-input"
                            value={emailSearch}
                            onChange={(e) => {
                                setEmailSearch(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                        <span className="users__filter-label">Поиск по email</span>
                    </div>
                    <div className="users__filter-group">
                        <input
                            type="text"
                            placeholder="Например: Магомед"
                            className="users__filter-input"
                            value={nameSearch}
                            onChange={(e) => {
                                setNameSearch(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                        <span className="users__filter-label">Поиск по имени</span>
                    </div>
                    <div className="users__filter-group">
                        <select
                            className="users__filter-select"
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value)
                                setCurrentPage(1)
                            }}
                        >
                            <option value="all">Все роли</option>
                            {uniqueRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <span className="users__filter-label">Все роли</span>
                    </div>
                    <button className="users__reset-button" onClick={handleReset}>
                        Сбросить
                    </button>
                </div>

                <table className="users__table">
                    <thead className="users__table-head">
                        <tr>
                            <th>
                                <div className="users__th-content">
                                    Email
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="users__filter-icon">
                                        <path d="M1 3H11M3 6H9M5 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </div>
                            </th>
                            <th>
                                <div className="users__th-content">
                                    Полное имя
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="users__filter-icon">
                                        <path d="M1 3H11M3 6H9M5 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </div>
                            </th>
                            <th>Роль</th>
                            <th>Дата создания</th>
                            <th className="users__th-actions">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.fullName}</td>
                                <td>{user.role}</td>
                                <td>{user.createdAt}</td>
                                <td className="users__td-actions">
                                    <button 
                                        className="users__action-button" 
                                        onClick={() => handleEdit(user.id)}
                                        aria-label="Редактировать"
                                    >
                                        <img src='/assets/icons/pen-icon.svg' alt="Edit"/>
                                    </button>
                                    <button 
                                        className="users__action-button users__action-button--delete" 
                                        onClick={() => handleDelete(user.id)}
                                        aria-label="Удалить"
                                    >
                                        <img src='/assets/icons/delete-icon.svg' alt="Delete"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div className="users__pagination">
                    <button 
                        className="users__pagination-button"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Пред
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            className={`users__pagination-button ${currentPage === page ? 'users__pagination-button--active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button 
                        className="users__pagination-button"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        След
                    </button>
                </div>
            </div>

            {isCreateOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal__header">
                            <h2 className="modal__title">Создать пользователя</h2>
                            <button
                                type="button"
                                className="modal__close"
                                onClick={handleCloseCreate}
                                aria-label="Закрыть"
                                disabled={isSaving}
                            >
                                ×
                            </button>
                        </div>
                        <form className="modal__form" onSubmit={handleCreateSubmit}>
                            <label className="modal__label">
                                Email
                                <input
                                    className="modal__input"
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="example@gmail.ru"
                                    required
                                />
                            </label>
                            <label className="modal__label">
                                ФИО
                                <input
                                    className="modal__input"
                                    type="text"
                                    value={newFullName}
                                    onChange={(e) => setNewFullName(e.target.value)}
                                    placeholder="Иванов Иван Иванович"
                                />
                            </label>
                            <label className="modal__label">
                                Роль
                                <div className="modal__select" onClick={() => setRoleSelectOpen(prev => !prev)}>
                                    <span className="modal__select-label">
                                        {combinedSelectedRoleLabel}
                                    </span>
                                    <span className="modal__select-arrow">▾</span>
                                </div>
                                {roleSelectOpen && (
                                    <div className="modal__select-dropdown">
                                        {roles.map(role => (
                                            <label key={role.id} className="modal__checkbox-option">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRoleIds.includes(role.id)}
                                                    onChange={() => toggleRole(role.id)}
                                                />
                                                <span>{role.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </label>
                            <label className="modal__label">
                                Пароль
                                <input
                                    className="modal__input"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Введите пароль"
                                    required
                                />
                            </label>
                            <div className="modal__actions">
                                <button
                                    type="button"
                                    className="modal__button modal__button--secondary"
                                    onClick={handleCloseCreate}
                                    disabled={isSaving}
                                >
                                    Отменить
                                </button>
                                <button
                                    type="submit"
                                    className="modal__button modal__button--primary"
                                    disabled={
                                        isSaving ||
                                        !newEmail.trim() ||
                                        !newPassword.trim() ||
                                        selectedRoleIds.length === 0
                                    }
                                >
                                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UsersTable
