import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const Banner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 md:px-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] w-full max-w-7xl mx-auto rounded-2xl overflow-hidden'
    >
      <motion.div
        className='flex flex-col gap-2 max-w-2xl text-white'
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h2
          className='text-white text-3xl font-medium'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Do You Own a Luxury Car?
        </motion.h2>

        <motion.p
          className='text-white text-sm mt-2'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Monetize your vehicle effortlessly by listing it on CarRental.
        </motion.p>

        <motion.p
          className='max-w-lg'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          We take care of insurance, driver verification and secure payments- so
          you can earn passive income, stress-free
        </motion.p>

        <motion.button
          whileHover={{
            scale: 1.03,
            backgroundColor: '#f8fafc',
          }}
          whileTap={{ scale: 0.98 }}
          className='px-6 py-2 max-w-40 bg-white hover:bg-slate-100 transition-all text-blue-600 rounded-lg text-sm mt-4 cursor-pointer'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          List your Car
        </motion.button>
      </motion.div>

      <motion.img
        src={assets.banner_car_image}
        alt='Car'
        className='max-h-45 mt-10 max-w-2xl'
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      />
    </motion.div>
  )
}

export default Banner
