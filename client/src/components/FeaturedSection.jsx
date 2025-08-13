import React from 'react'
import { motion } from 'framer-motion'
import Title from './Title'
import { assets } from '../assets/assets'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {
  const navigate = useNavigate()
  const { cars } = useAppContext()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -10,
      scale: 1.05,
      boxShadow: '0 15px 30px -5px rgba(0,0,0,0.15)',
    },
  }

  return (
    <motion.div
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, margin: '-100px' }}
      className='flex flex-col items-center py-24 px-6 md:px-16 lg:24px xl:px-32'
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Title
          title='Featured Vehicles'
          subTitle='Explore our section of premium vehicles available for your next adventure'
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-16 w-full max-w-7xl'
      >
        {cars.slice(0, 6).map((car) => (
          <motion.div
            key={car._id}
            variants={cardVariants}
            whileHover='hover'
            className='p-4 transform transition-all duration-300'
          >
            <div className='scale-110 origin-center'>
              {' '}
              <CarCard car={car} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        whileHover={{
          scale: 1.05,
          backgroundColor: '#f8fafc',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        }}
        whileTap={{
          scale: 0.98,
        }}
        className='flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 rounded-md mt-18 cursor-pointer text-lg'
        onClick={() => {
          navigate('/cars')
          window.scrollTo(0, 0)
        }}
      >
        Explore all Cars{' '}
        <img src={assets.arrow_icon} alt='arrow' className='w-5 h-5' />
      </motion.button>
    </motion.div>
  )
}

export default FeaturedSection
