'use client'
import { useEffect, useState } from 'react'
import './page.css'
import AdminSidebar from '@/components/AdminSidebar'
import { getCurrentUserFromApi } from '@/lib/api'

const AdminPage = () => {
    const [userName, setUserName] = useState<string>('')

    useEffect(() => {
        getCurrentUserFromApi().then((user) => {
            if (user?.fullname?.trim()) {
                setUserName(user.fullname.trim())
            } else if (user?.email) {
                setUserName(user.email)
            } else {
                setUserName('')
            }
        }).catch(() => setUserName(''))
    }, [])

    const displayName = userName || 'Гость'

    return (
        <div className="main-container">
            <AdminSidebar />
            <div className='admin-welcome-container'>
                <div className='admin-welcome-content'>
                    <h1 className='admin-welcome-title'>
                        Здравствуйте, <span className='admin-welcome-name'>{displayName},</span>
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