import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Layout = () => {
  const { isOwner, navigate, loading, user } = useAppContext()

  useEffect(() => {
    if (!loading && user && !isOwner) {
      navigate('/')
      toast.error('You are not authorized to access this page')
    }
  }, [isOwner, loading, user, navigate])

  if (loading || !user) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <span className='text-primary text-lg'>Loading...</span>
      </div>
    )
  }

  if (!isOwner) {
    return null
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <NavbarOwner />
      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1 p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
