import React from 'react'
import { motion } from 'framer-motion'

const Newsletter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className='flex flex-col items-center justify-center text-center space-y-2 px-6 md:px-16 lg:px-32 my-20 mb-40 w-full max-w-7xl mx-auto'
    >
      <motion.h1
        className='md:text-4xl text-2xl font-semibold mb-4'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Never Miss a Deal!
      </motion.h1>

      <motion.p
        className='md:text-lg text-gray-500/70 pb-8 max-w-2xl'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts
      </motion.p>

      <motion.form
        className='flex items-center justify-between w-full max-w-2xl h-14'
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <motion.input
          className='border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-4 text-gray-500 text-md'
          type='email'
          placeholder='Enter your email id'
          required
          whileFocus={{
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 1px #3b82f6',
          }}
        />
        <motion.button
          type='submit'
          className='px-8 md:px-12 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none text-md font-medium'
          whileHover={{
            scale: 1.02,
            backgroundColor: '#1d4ed8',
          }}
          whileTap={{
            scale: 0.98,
          }}
        >
          Subscribe
        </motion.button>
      </motion.form>
    </motion.div>
  )
}

export default Newsletter
