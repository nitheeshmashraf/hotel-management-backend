// controllers/bookingController.js

const bookingModel = require('../models/bookingModel')
const admin = require('../config/firebase-admin')
const db = admin.firestore()

// fake inserts====================================================
const fakeRooms = [
  { id: 1, number: '101', type: 'Single', status: 'active' },
  { id: 2, number: '102', type: 'Double', status: 'active' },
  { id: 3, number: '103', type: 'Suite', status: 'active' },
  { id: 4, number: '104', type: 'Single', status: 'inactive' },
  { id: 5, number: '105', type: 'Double', status: 'active' },
  { id: 6, number: '106', type: 'Suite', status: 'inactive' },
  { id: 7, number: '107', type: 'Single', status: 'active' },
  { id: 8, number: '108', type: 'Double', status: 'inactive' },
  { id: 9, number: '109', type: 'Suite', status: 'active' },
  { id: 10, number: '110', type: 'Single', status: 'active' },
  { id: 11, number: '111', type: 'Double', status: 'inactive' },
  { id: 12, number: '112', type: 'Suite', status: 'active' },
  { id: 13, number: '113', type: 'Single', status: 'inactive' },
  { id: 14, number: '114', type: 'Double', status: 'active' },
  { id: 15, number: '115', type: 'Suite', status: 'inactive' },
  { id: 16, number: '116', type: 'Single', status: 'active' },
  { id: 17, number: '117', type: 'Double', status: 'active' },
  { id: 18, number: '118', type: 'Suite', status: 'inactive' },
  { id: 19, number: '119', type: 'Single', status: 'active' },
  { id: 20, number: '120', type: 'Double', status: 'inactive' },
]
const insertSampleDocs = async () => {
  try {
    await bookingModel.insertBookings(fakeRooms)
    console.log('Docs added successfully')
  } catch (error) {
    console.error('Error:', error.message)
  }
}
// insertSampleBookings()
// fake inserts====================================================

// Create a new booking
exports.createBooking = async (req, res) => {
  const bookingData = req.body

  try {
    const bookingId = await bookingModel.createBooking(bookingData)
    res.status(201).json({ message: 'Booking created successfully', bookingId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get a booking by ID
exports.getBookingById = async (req, res) => {
  const { bookingId } = req.params

  try {
    const booking = await bookingModel.getBookingById(bookingId)
    res.status(200).json(booking)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get a booking by ID
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings()

    res.status(200).json(bookings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update booking details
exports.updateBooking = async (req, res) => {
  const { bookingId } = req.params
  const updatedData = req.body

  try {
    await bookingModel.updateBooking(bookingId, updatedData)
    res.status(200).json({ message: 'Booking updated successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Delete a booking
exports.deleteBooking = async (req, res) => {
  const { bookingId } = req.params

  try {
    await bookingModel.deleteBooking(bookingId)
    res.status(200).json({ message: 'Booking deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
