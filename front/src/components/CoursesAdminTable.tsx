'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  createAdminCourseOnApi,
  deleteAdminCourseOnApi,
  exportCourseRegistrationsFromApi,
  fetchAdminCoursesFromApi,
  fetchCourseRegistrationsFromApi,
  updateAdminCourseOnApi,
  type ApiCourse,
  type ApiCourseRegistration,
} from '@/lib/api'

const formatDate = (raw?: string | null) => {
  if (!raw) return '—'
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const CoursesAdminTable = () => {
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [registrations, setRegistrations] = useState<ApiCourseRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newCourseTitle, setNewCourseTitle] = useState('')

  const [editCourseId, setEditCourseId] = useState<number | null>(null)
  const [editCourseTitle, setEditCourseTitle] = useState('')

  const [registrationSearch, setRegistrationSearch] = useState('')

  const loadAll = async () => {
    try {
      setLoading(true)
      setError(null)
      const [coursesList, registrationsList] = await Promise.all([
        fetchAdminCoursesFromApi(),
        fetchCourseRegistrationsFromApi(),
      ])
      setCourses(coursesList)
      setRegistrations(registrationsList)
    } catch (e) {
      console.error('Failed to load courses admin data', e)
      setError('Не удалось загрузить данные по курсам.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAll()
  }, [])

  const filteredRegistrations = useMemo(() => {
    const query = registrationSearch.trim().toLowerCase()
    if (!query) return registrations
    return registrations.filter((item) =>
      [item.full_name, item.email, item.phone, item.course_title]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [registrationSearch, registrations])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    const title = newCourseTitle.trim()
    if (!title) return

    try {
      setSaving(true)
      setError(null)
      await createAdminCourseOnApi(title)
      setIsCreateOpen(false)
      setNewCourseTitle('')
      await loadAll()
    } catch (err) {
      console.error('Не удалось создать курс', err)
      setError('Не удалось создать курс.')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (course: ApiCourse) => {
    setEditCourseId(course.id)
    setEditCourseTitle(course.title)
  }

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (editCourseId == null) return
    const title = editCourseTitle.trim()
    if (!title) return

    try {
      setSaving(true)
      setError(null)
      await updateAdminCourseOnApi(editCourseId, title)
      setEditCourseId(null)
      setEditCourseTitle('')
      await loadAll()
    } catch (err) {
      console.error('Не удалось обновить курс', err)
      setError('Не удалось обновить курс.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (courseId: number) => {
    if (!confirm('Удалить курс?')) return

    try {
      setSaving(true)
      setError(null)
      await deleteAdminCourseOnApi(courseId)
      await loadAll()
    } catch (err) {
      console.error('Не удалось удалить курс', err)
      setError('Не удалось удалить курс.')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async () => {
    try {
      setSaving(true)
      setError(null)
      const file = await exportCourseRegistrationsFromApi()
      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = 'course_registrations.xlsx'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Не удалось экспортировать заявки', err)
      setError('Не удалось скачать Excel.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="courses-admin">
        <div className="courses-admin__loading">Загрузка данных...</div>
      </div>
    )
  }

  return (
    <div className="courses-admin">
      <div className="courses-admin__header">
        <h1 className="courses-admin__title">Курсы и заявки</h1>
        <div className="courses-admin__actions">
          <button
            className="courses-admin__button courses-admin__button--ghost"
            onClick={handleExport}
            disabled={saving}
            type="button"
          >
            Экспорт в Excel
          </button>
          <button
            className="courses-admin__button courses-admin__button--primary"
            onClick={() => setIsCreateOpen(true)}
            disabled={saving}
            type="button"
          >
            Создать курс
          </button>
        </div>
      </div>

      {error ? <div className="courses-admin__error">{error}</div> : null}

      <div className="courses-admin__panel">
        <h2 className="courses-admin__panel-title">Курсы</h2>
        <table className="courses-admin__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Создан</th>
              <th className="courses-admin__table-actions-cell">Действия</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.title}</td>
                <td>{formatDate(course.created_at)}</td>
                <td className="courses-admin__table-actions-cell">
                  <button
                    className="courses-admin__icon-btn"
                    onClick={() => startEdit(course)}
                    type="button"
                    disabled={saving}
                    aria-label="Редактировать"
                  >
                    <img src="/assets/icons/pen-icon.svg" alt="edit" />
                  </button>
                  <button
                    className="courses-admin__icon-btn courses-admin__icon-btn--danger"
                    onClick={() => handleDelete(course.id)}
                    type="button"
                    disabled={saving}
                    aria-label="Удалить"
                  >
                    <img src="/assets/icons/delete-icon.svg" alt="delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="courses-admin__panel">
        <div className="courses-admin__panel-head">
          <h2 className="courses-admin__panel-title">Заявки на курсы</h2>
          <input
            className="courses-admin__search"
            type="text"
            placeholder="Поиск по ФИО, email, телефону, курсу"
            value={registrationSearch}
            onChange={(e) => setRegistrationSearch(e.target.value)}
          />
        </div>

        <table className="courses-admin__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Курс</th>
              <th>Тариф</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.full_name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.course_title}</td>
                <td>{item.support_type === 'with_support' ? 'С поддержкой' : 'Базовый'}</td>
                <td>{formatDate(item.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateOpen ? (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <h2 className="modal__title">Создать курс</h2>
              <button
                type="button"
                className="modal__close"
                onClick={() => setIsCreateOpen(false)}
                aria-label="Закрыть"
                disabled={saving}
              >
                ×
              </button>
            </div>
            <form className="modal__form" onSubmit={handleCreate}>
              <label className="modal__label">
                Название курса
                <input
                  className="modal__input"
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="Новый курс"
                />
              </label>
              <div className="modal__actions">
                <button
                  type="button"
                  className="modal__button modal__button--secondary"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={saving}
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  className="modal__button modal__button--primary"
                  disabled={saving || !newCourseTitle.trim()}
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editCourseId != null ? (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <h2 className="modal__title">Изменить курс</h2>
              <button
                type="button"
                className="modal__close"
                onClick={() => setEditCourseId(null)}
                aria-label="Закрыть"
                disabled={saving}
              >
                ×
              </button>
            </div>
            <form className="modal__form" onSubmit={handleUpdate}>
              <label className="modal__label">
                Название курса
                <input
                  className="modal__input"
                  type="text"
                  value={editCourseTitle}
                  onChange={(e) => setEditCourseTitle(e.target.value)}
                  placeholder="Название курса"
                />
              </label>
              <div className="modal__actions">
                <button
                  type="button"
                  className="modal__button modal__button--secondary"
                  onClick={() => setEditCourseId(null)}
                  disabled={saving}
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  className="modal__button modal__button--primary"
                  disabled={saving || !editCourseTitle.trim()}
                >
                  {saving ? 'Сохранение...' : 'Обновить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CoursesAdminTable
