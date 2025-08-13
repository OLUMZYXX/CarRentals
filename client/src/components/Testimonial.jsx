import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const Testimonial = () => {
  const testimonials = [
    {
      name: 'Emma Rodriguez',
      location: 'Barcelona, Spain',
      image: assets.testimonial_image_1,
      testimonial:
        "I've rented cars from various companies, but the experience with CarRental was exceptional.",
    },
    {
      name: 'Liam Johnson',
      location: 'New York, USA',
      image: assets.testimonial_image_2,
      testimonial:
        'Car Rental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!',
    },
    {
      name: 'Sophia Lee',
      location: 'Seoul, South Korea',
      image: assets.testimonial_image_1,
      testimonial:
        "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
    },
  ]

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -10,
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className='py-28 px-6 md:px-16 lg:px-24 xl:px-44 bg-gray-50' // Added light background
    >
      <motion.div
        className='text-center mb-16' // Increased margin-bottom
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
          What Our Customers Say
        </h2>
        <motion.p
          className='text-gray-600 max-w-2xl mx-auto text-lg' // Increased text size
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Discover why discerning travelers choose CarRental for their luxury
          car rentals around the world.
        </motion.p>
      </motion.div>

      <motion.div
        variants={container}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 mb-10' // Increased gap
      >
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover='hover'
            className='bg-white p-8 rounded-xl shadow-lg transition-all duration-300 cursor-default' // Increased padding
          >
            <div className='flex items-center gap-4 mb-6'>
              {' '}
              {/* Increased gap and margin */}
              <motion.img
                className='w-14 h-14 rounded-full object-cover' // Larger image
                src={testimonial.image}
                alt={testimonial.name}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              />
              <div>
                <p className='text-xl font-semibold text-gray-800'>
                  {testimonial.name}
                </p>
                <p className='text-gray-500 text-sm'>{testimonial.location}</p>
              </div>
            </div>
            <div className='flex items-center gap-1 mb-6'>
              {' '}
              {/* Increased margin */}
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <motion.img
                    key={index}
                    src={assets.star_icon}
                    alt='star-icon'
                    className='w-5 h-5' // Larger stars
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
            </div>
            <motion.p
              className='text-gray-600 mt-4 font-light leading-relaxed text-lg' // Increased text size
              whileHover={{ color: '#4b5563' }} // Slightly darker on hover
            >
              "{testimonial.testimonial}"
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Testimonial
