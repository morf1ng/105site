'use client'

import { useEffect, useState } from "react"
import { fetchProjectsFromApi, getImageUrl, type ApiProject } from "@/lib/api"
import Link from "next/link"

const Portfolio = () => {
    const [projects, setProjects] = useState<ApiProject[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchProjectsFromApi()
                setProjects(data)
            } catch (error) {
                console.error("Failed to fetch projects:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadProjects()
    }, [])

    if (isLoading) {
        return (
            <section id="portfolio" className="portfolio">
                <div className="portfolio__container container">
                    <div className="portfolio__title block__title">Наши проекты</div>
                    <div className="portfolio__cards">
                        <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>Загрузка проектов...</p>
                    </div>
                </div>
            </section>
        )
    }

    if (projects.length === 0) {
        return null // Не показываем секцию, если проектов нет
    }

    return (
        <section id="portfolio" className="portfolio">
            <div className="portfolio__container container">
                <div className="portfolio__title block__title">Наши проекты</div>
                <div className="portfolio__cards">
                    {projects.map((project) => (
                        <div className="portfolio__card glass-border" key={project.id}>
                            <div className="portfolio__card-img">
                                <img 
                                    src={getImageUrl(project.preview_img) || '/assets/images/hero.png'} 
                                    alt={project.title} 
                                    loading="lazy"
                                    decoding="async"
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                />
                            </div>
                            <div className="portfolio__card-title">{project.title}</div>
                            <div className="portfolio__card-subtitle">
                                {project.result ? (typeof project.result === 'string' ? JSON.parse(project.result).description : (project.result as any).description) : ''}
                            </div>
                            
                            <div className="portfolio__card-list">
                                {/* Выводим первые два пункта из прогресса как в макете */}
                                {project.progress && (typeof project.progress === 'string' ? JSON.parse(project.progress) : project.progress).slice(0, 2).map((p: any, idx: number) => (
                                    <div className="portfolio__card-list-element" key={idx}>
                                        <img className="portfolio__card-list-element-icon" src="assets/icons/check.svg" alt=""/>
                                        <div className="portfolio__card-list-element-text">{p.text}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <Link className="portfolio__card-btn hero__left-link" href={`/projects/${project.id}`}>
                                Посмотреть проект
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Portfolio
