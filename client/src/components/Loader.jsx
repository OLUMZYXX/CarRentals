import React from 'react'
import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <div className='flex justify-center items-center h-[80vh]'>
      <motion.div
        className='relative flex justify-center items-center'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className='absolute h-16 w-16 border-4 border-gray-200 rounded-full'
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 1.5,
              ease: 'linear',
              repeat: Infinity,
            },
            scale: {
              duration: 1.5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            },
          }}
        />

        <motion.div
          className='absolute h-12 w-12 border-4 border-primary border-r-transparent rounded-full'
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            rotate: {
              duration: 1,
              ease: 'linear',
              repeat: Infinity,
            },
            scale: {
              duration: 1.5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            },
          }}
        />

        <motion.div
          className='absolute h-3 w-3 bg-primary rounded-full'
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  )
}

export default Loader
