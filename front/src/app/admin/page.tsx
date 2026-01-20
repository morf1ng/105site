'use client'
import './page.css'
import AdminSidebar from '@/components/AdminSidebar'

const AdminPage = () => {
    return (
        <div className="main-container">
            <AdminSidebar />
            <div className='admin-welcome-container'>
                <div className='admin-welcome-content'>
                    <h1 className='admin-welcome-title'>
                        Здравствуйте, <span className='admin-welcome-name'>Али,</span>
                    </h1>
                    <p className='admin-welcome-subtitle'>
                        вы попали в админ-панель.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AdminPage