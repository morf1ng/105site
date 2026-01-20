'use client'
import Link from 'next/link'
import '../app/admin/page.css'

type AdminSidebarProps = {
    activePage?: 'projects' | 'users' | 'roles'
}

const AdminSidebar = ({ activePage }: AdminSidebarProps) => {
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/auth/login';
        }
    }

    return (
        <div className='sidebar-container--desktop'>
            <div className='sidebar__logo--desktop'>
                <img src='/assets/icons/ss-icon-text.svg' alt="SOFTSTUDIO"/>
            </div>
            <div className='sidebar__control-container--desktop'>
                <div className='sidebar__nav-container--desktop'>
                    <Link 
                        href="/admin/projects" 
                        className={activePage === 'projects' ? 'sidebar__nav--active' : 'sidebar__nav'}
                    >
                        Проекты
                    </Link>
                    <Link 
                        href="/admin/users" 
                        className={activePage === 'users' ? 'sidebar__nav--active' : 'sidebar__nav'}
                    >
                        Пользователи
                    </Link>
                    <Link 
                        href="/admin/roles" 
                        className={activePage === 'roles' ? 'sidebar__nav--active' : 'sidebar__nav'}
                    >
                        Роли
                    </Link>
                </div>
                <div className='sidebar__settings-container--desktop'>
                    <button className='sidebar__settings-button'>
                        Настройки
                    </button>
                    <button className='sidebar__settings-button'>
                        Аккаунт
                    </button>
                    <button 
                        className='sidebar__settings-button' 
                        style={{ color: '#ff4d4d', marginTop: '10px', opacity: 0.8 }}
                        onClick={handleLogout}
                    >
                        Выйти
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminSidebar
