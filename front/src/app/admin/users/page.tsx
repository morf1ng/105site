'use client'
import AdminSidebar from '@/components/AdminSidebar'
import UsersTable from '@/components/UsersTable'
import '../page.css'

const UsersPage = () => {
    return (
        <div className="main-container">
            <AdminSidebar activePage="users" />
            <div className='table-container--desktop'>
                <UsersTable />
            </div>
        </div>
    )
}

export default UsersPage


