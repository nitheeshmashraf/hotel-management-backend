// routes/bookingRoutes.js

const express = require('express')
const bookingController = require('../controllers/bookingController')

const router = express.Router()

// Get a all booking
router.get('/', bookingController.getAllBookings)

// Create a new booking
router.post('/', bookingController.createBooking)

// Get a booking by ID
router.get('/:bookingId', bookingController.getBookingById)

// Update booking details
router.put('/:bookingId', bookingController.updateBooking)

// Delete a booking
router.delete('/:bookingId', bookingController.deleteBooking)

module.exports = router
