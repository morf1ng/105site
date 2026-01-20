import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { fetchRolesFromApi, createRoleOnApi, updateRoleOnApi, deleteRoleOnApi, type ApiRole } from '@/lib/api'

const RolesTable = () => {
    const [roles, setRoles] = useState<ApiRole[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newRoleName, setNewRoleName] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editRoleName, setEditRoleName] = useState('')
    const [loading, setLoading] = useState(true)

    const loadRoles = async () => {
        try {
            setLoading(true)
            const list = await fetchRolesFromApi()
            setRoles(list)
        } catch (e) {
            console.error('Не удалось загрузить роли из API', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadRoles()
    }, [])

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage)

    const handleEdit = (id: number) => {
        const role = roles.find(r => r.id === id)
        if (role) {
            setEditingId(id)
            setEditRoleName(role.name)
        }
    }

    const handleEditSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!editingId || !editRoleName.trim()) return

        try {
            setIsSaving(true)
            await updateRoleOnApi(editingId, { name: editRoleName.trim() })
            setEditingId(null)
            setEditRoleName('')
            await loadRoles()
        } catch (err) {
            console.error('Не удалось обновить роль', err)
            alert('Не удалось обновить роль')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Вы уверены, что хотите удалить эту роль?')) {
            return
        }

        try {
            await deleteRoleOnApi(id)
            await loadRoles()
        } catch (err) {
            console.error('Не удалось удалить роль', err)
            alert('Не удалось удалить роль')
        }
    }

    const handleOpenCreate = () => {
        setNewRoleName('')
        setIsCreateOpen(true)
    }

    const handleCloseCreate = () => {
        if (isSaving) return
        setIsCreateOpen(false)
    }

    const handleCreateSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const trimmed = newRoleName.trim()
        if (!trimmed) return

        try {
            setIsSaving(true)
            await createRoleOnApi({ name: trimmed.slice(0, 50) })
            setIsCreateOpen(false)
            await loadRoles()
        } catch (err) {
            console.error('Не удалось создать роль', err)
            alert('Не удалось создать роль')
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="roles__main-container">
                <div>Загрузка...</div>
            </div>
        )
    }

    return (
        <div className="roles__main-container">
            <h1 className="roles__page-title">Управление ролями</h1>
            <div className="roles__command-panel">
                <div className="roles__search">
                    <img src='/assets/icons/search-icon.svg' alt="Search"/>
                    <input 
                        type="text"
                        placeholder="Поиск роли" 
                        className="transparent-input roles__search-field"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>
                <button
                    className="roles__create-button"
                    onClick={handleOpenCreate}
                >
                    Создать роль
                </button>
            </div>

            <div className="roles__table-container">
                <table className="roles__table">
                    <thead className="roles__table-head">
                        <tr>
                            <th>
                                <div className="roles__th-content">
                                    ID
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="roles__filter-icon">
                                        <path d="M1 3H11M3 6H9M5 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </div>
                            </th>
                            <th>
                                <div className="roles__th-content">
                                    Название роли
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="roles__filter-icon">
                                        <path d="M1 3H11M3 6H9M5 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </div>
                            </th>
                            <th className="roles__th-actions">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRoles.map(role => (
                            <tr key={role.id}>
                                <td>{role.id}</td>
                                <td>
                                    {editingId === role.id ? (
                                        <form onSubmit={handleEditSubmit} style={{ display: 'inline' }}>
                                            <input
                                                type="text"
                                                value={editRoleName}
                                                onChange={(e) => setEditRoleName(e.target.value.slice(0, 50))}
                                                style={{ 
                                                    background: 'transparent', 
                                                    border: '1px solid rgba(255,255,255,0.3)', 
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    maxWidth: '200px'
                                                }}
                                                autoFocus
                                            />
                                            <button
                                                type="submit"
                                                style={{
                                                    marginLeft: '8px',
                                                    padding: '4px 12px',
                                                    background: 'var(--accent, #633BC0)',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                }}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? '...' : '✓'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(null)
                                                    setEditRoleName('')
                                                }}
                                                style={{
                                                    marginLeft: '4px',
                                                    padding: '4px 12px',
                                                    background: 'transparent',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '4px',
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                }}
                                                disabled={isSaving}
                                            >
                                                ✕
                                            </button>
                                        </form>
                                    ) : (
                                        role.name
                                    )}
                                </td>
                                <td className="roles__td-actions">
                                    <button 
                                        className="roles__action-button" 
                                        onClick={() => handleEdit(role.id)}
                                        aria-label="Редактировать"
                                        disabled={editingId !== null && editingId !== role.id}
                                    >
                                        <img src='/assets/icons/pen-icon.svg' alt="Edit"/>
                                    </button>
                                    <button 
                                        className="roles__action-button roles__action-button--delete" 
                                        onClick={() => handleDelete(role.id)}
                                        aria-label="Удалить"
                                        disabled={editingId !== null}
                                    >
                                        <img src='/assets/icons/delete-icon.svg' alt="Delete"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div className="roles__pagination">
                    <button 
                        className="roles__pagination-button"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Пред.
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            className={`roles__pagination-button ${currentPage === page ? 'roles__pagination-button--active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button 
                        className="roles__pagination-button"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        След.
                    </button>
                </div>
            </div>

            {isCreateOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal__header">
                            <h2 className="modal__title">Создать роль</h2>
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
                                Название роли
                                <input
                                    className="modal__input"
                                    type="text"
                                    value={newRoleName}
                                    onChange={(e) =>
                                        setNewRoleName(e.target.value.slice(0, 50))
                                    }
                                    placeholder="Введите название роли"
                                />
                                <span className="modal__help">
                                    Максимум 50 символов
                                </span>
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
                                    disabled={isSaving || !newRoleName.trim()}
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

export default RolesTable
