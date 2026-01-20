'use client'
import AdminSidebar from '@/components/AdminSidebar'
import RolesTable from '@/components/RolesTable'
import '../page.css'

const RolesPage = () => {
    return (
        <div className="main-container">
            <AdminSidebar activePage="roles" />
            <div className='table-container--desktop'>
                <RolesTable />
            </div>
        </div>
    )
}

export default RolesPage

