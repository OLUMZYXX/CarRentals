import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const { user, axios, fetchUser, token } = useAppContext()
  const location = useLocation()
  const [image, setImage] = useState('')

  const updateImage = async () => {
    try {
      const formData = new FormData()
      formData.append('image', image)
      // Ensure Authorization header is set for this request
      const headers = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {}
      const { data } = await axios.post(
        '/api/owner/update-profile',
        formData,
        headers
      )
      if (data.success) {
        await fetchUser()
        setTimeout(() => setImage(''), 100) // ensure fetchUser runs before clearing
        toast.success('Image updated successfully')
      } else {
        toast.error('Failed to update image')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to update image')
    }
  }

  // Function to get image URL with cache busting
  const getImageUrl = () => {
    if (image) {
      return URL.createObjectURL(image)
    }
    if (user?.profileImage) {
      // Add timestamp to prevent caching issues
      const separator = user.profileImage.includes('?') ? '&' : '?'
      return `${user.profileImage}${separator}t=${Date.now()}`
    }
    return 'https://ik.imagekit.io/p1kmwsufx/smiling-young-man-illustration.png?updatedAt=1754644313355'
  }

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>
      <div className='group relative'>
        <label htmlFor='image'>
          <img
            src={getImageUrl()}
            alt='User avatar'
            className='h-9 md:h-14 w-9 md:w-14 rounded-full object-cover'
            key={user?.profileImage || 'default-profile'}
          />
          <input
            type='file'
            id='image'
            accept='image/*'
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
            <img src={assets.edit_icon} alt='edit icon' />
          </div>
        </label>
      </div>
      {image && (
        <button
          className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer'
          onClick={updateImage}
        >
          Save{' '}
          <img src={assets.check_icon} className='w-{13}' alt='checkicon' />
        </button>
      )}
      <p className='mt-2 text-base max-md:hidden'>{user?.name}</p>
      <div className='w-full'>
        {ownerMenuLinks.map((link, i) => (
          <NavLink
            key={i}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600'
            }`}
          >
            <img
              src={
                link.path === location.pathname ? link.coloredIcon : link.icon
              }
              alt='car icon'
            />
            <span className='max-md:hidden'>{link.name}</span>
            <div
              className={`${
                link.path === location.pathname && 'bg-primary'
              } w-1.5 h-8 rounded-1 right-0 absolute`}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
