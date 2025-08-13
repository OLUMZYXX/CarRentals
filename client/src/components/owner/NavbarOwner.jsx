import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const NavbarOwner = () => {
  const { user } = useAppContext()

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
      <Link to='/'>
        <img src={assets.logo} alt='logo' className='h-7' />
      </Link>
      <div className='flex items-center gap-3'>
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt='Profile'
            className='h-8 w-8 rounded-full object-cover border border-gray-300'
          />
        ) : (
          <img
            src={
              'https://ik.imagekit.io/p1kmwsufx/smiling-young-man-illustration.png?updatedAt=1754644313355'
            }
            alt='Default Profile'
            className='h-8 w-8 rounded-full object-cover border border-gray-300'
          />
        )}
        <p>Welcome, {user?.name || 'Owner'}</p>
      </div>
    </div>
  )
}

export default NavbarOwner
