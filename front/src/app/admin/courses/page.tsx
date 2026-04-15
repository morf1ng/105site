'use client'

import AdminSidebar from '@/components/AdminSidebar'
import CoursesAdminTable from '@/components/CoursesAdminTable'
import '../page.css'

const AdminCoursesPage = () => {
  return (
    <div className="main-container">
      <AdminSidebar activePage="courses" />
      <div className="table-container--desktop">
        <CoursesAdminTable />
      </div>
    </div>
  )
}

export default AdminCoursesPage
