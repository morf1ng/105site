'use client'
import ProjectsTable from '@/components/ProjectsTable'
import AdminSidebar from '@/components/AdminSidebar'
import '../page.css'

const ProjectsPage = () => {
    return (
        <div className="main-container">
            <AdminSidebar activePage="projects" />
            <div className='table-container--desktop'>
                <ProjectsTable />
            </div>
        </div>
    )
}

export default ProjectsPage

