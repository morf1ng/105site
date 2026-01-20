import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchProjectsFromApi, createProjectOnApi, deleteProjectOnApi, type ApiProject } from "@/lib/api"


type ProjectCollection = {
    selected: boolean,
    project: ApiProject
}

const ProjectsTable = () => {
    const router = useRouter()
    const [projects, setProjects] = useState<ProjectCollection[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [newUrl, setNewUrl] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const loadProjects = async () => {
        try {
            const list = await fetchProjectsFromApi()
            setProjects(
                list.map(proj => ({
                    selected: false,
                    project: proj
                }))
            )
        } catch (e) {
            console.error("Не удалось загрузить проекты из API", e)
        }
    }

    useEffect(() => {
        void loadProjects()
    }, [])

    const selectAll = (e: ChangeEvent<HTMLInputElement>) => {
        setProjects(projects.map(proj => {
            proj.selected = e.target.checked
            return proj
        }))
    }

    const selectProject = (id: string) => {
        setProjects(projects.map((proj) => {
            if (proj.project.id.toString() == id) {
                proj.selected = !proj.selected
            }
            return proj
        }))
    }

    const handleOpenCreate = () => {
        setNewTitle("")
        setNewUrl("")
        setIsCreateOpen(true)
    }

    const handleCloseCreate = () => {
        if (isCreating) return
        setIsCreateOpen(false)
    }

    const handleCreateSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!newTitle.trim() || !newUrl.trim()) return

        try {
            setIsCreating(true)
            const formData = new FormData()
            formData.append("title", newTitle.trim())
            formData.append("url", newUrl.trim())
            // Отправляем пустые, но валидные JSON структуры для обязательных полей
            formData.append("target", "")
            formData.append("task", "")
            formData.append("about_company", JSON.stringify({ title: "", description: "" }))
            formData.append("stages", JSON.stringify([]))
            formData.append("result", JSON.stringify({ description: "", images: [] }))
            formData.append("progress", JSON.stringify([]))

            await createProjectOnApi(formData)
            setIsCreateOpen(false)
            await loadProjects()
        } catch (err) {
            console.error("Не удалось создать проект", err)
        } finally {
            setIsCreating(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Вы уверены, что хотите удалить этот проект?")) {
            return
        }

        try {
            await deleteProjectOnApi(id)
            await loadProjects()
        } catch (err) {
            console.error("Не удалось удалить проект", err)
            alert("Не удалось удалить проект")
        }
    }

    return (
        <div className="projects__main-container">
            <div className="projects__command-panel">
                <div className="projects__search">
                    <img src='/assets/icons/search-icon.svg'/>
                    <input placeholder="Поиск проекта" className="transparent-input projects__search-field" />
                </div>
                <button
                    className="projects__project-add"
                    onClick={handleOpenCreate}
                >
                    Добавить проект
                </button>
            </div>

            <div className="projects__table-container">
                <table className="projects__table">
                    <thead className="projects__table-head">
                        <tr>

                            <th>Название проекта</th>
                            <th>Превью</th>
                            <th>URL</th>
                            <th>Дата создания</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projects.map(proj => (
                                <tr key={proj.project.id}>
                                    <td key={proj.project.id.toString().concat("-title-container")}>
                                        <div className="table-flex" key={proj.project.id.toString().concat("-title-container-div")}>
                                            <p key={proj.project.id.toString().concat("-title")}>{proj.project.title}</p>
                                            <p key={proj.project.id.toString().concat("-id")} className="table__sub-text">id {proj.project.id}</p>
                                        </div>
                                    </td>
                                    <td key={String(proj.project.id).concat("-preview")}>{proj.project.id}</td>
                                    <td key={proj.project.id.toString().concat("-url")}><a href={proj.project.url}>{proj.project.url}</a></td>
                                    <td key={proj.project.id.toString().concat("-date")}>
                                        {proj.project.created_at
                                            ? new Date(proj.project.created_at).toUTCString()
                                            : ""}
                                    </td>
                                    <td className="td-container" key={proj.project.id.toString().concat("-action-container")}>
                                        <button 
                                            className="td-button" 
                                            key={proj.project.id.toString().concat("-action-re-button")}
                                            onClick={() => router.push(`/admin/projects/${proj.project.id}`)}
                                            aria-label="Редактировать"
                                        >
                                            <img src='/assets/icons/pen-icon.svg' alt="Edit" key={proj.project.id.toString().concat("-action-re-icon")}/>
                                        </button>
                                        <button 
                                            className="td-button" 
                                            key={proj.project.id.toString().concat("-action-del-button")}
                                            onClick={() => handleDelete(proj.project.id)}
                                            aria-label="Удалить"
                                        >
                                            <img src='/assets/icons/delete-icon.svg' alt="Delete" key={proj.project.id.toString().concat("-action-del-icon")}/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {isCreateOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className="modal__title">Добавить проект</h2>
                        <form className="modal__form" onSubmit={handleCreateSubmit}>
                            <label className="modal__label">
                                Название
                                <input
                                    className="modal__input"
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Введите название проекта"
                                />
                            </label>
                            <label className="modal__label">
                                Ссылка
                                <input
                                    className="modal__input"
                                    type="text"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    placeholder="https://example.com"
                                />
                            </label>
                            <div className="modal__actions">
                                <button
                                    type="button"
                                    className="modal__button modal__button--secondary"
                                    onClick={handleCloseCreate}
                                    disabled={isCreating}
                                >
                                    Отменить
                                </button>
                                <button
                                    type="submit"
                                    className="modal__button modal__button--primary"
                                    disabled={isCreating}
                                >
                                    {isCreating ? "Добавление..." : "Добавить проект"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectsTable