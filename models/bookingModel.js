// models/bookingModel.js

const admin = require('../config/firebase-admin')
const db = admin.firestore()

// Define the booking schema
const bookingSchema = {
  id: String,
  guestName: String,
  contactNumber: String,
  checkIn: String,
  checkOut: String,
  room: Number,
  occupants: Number,
  total: Number,
  paymentModes: Map,
  totalPaid: Number,
  balancetoPay: Number,
  is_checkedOut: Boolean,
  bookingDate: String,
  status: String,
}

// sample docs insert=============================================================
const insertSampleDocs = async (bookings) => {
  const batch = db.batch() // Create a Firestore batch object
  const bookingsCollection = db.collection('rooms')

  try {
    // Iterate over each booking and add it to the batch
    bookings.forEach((booking) => {
      const docRef = bookingsCollection.doc() // Create a new document reference
      batch.set(docRef, booking)
    })

    // Commit the batch
    await batch.commit()
    console.log('All bookings inserted successfully')
  } catch (error) {
    console.error('Error inserting bookings:', error.message)
    throw new Error(`Error inserting bookings: ${error.message}`)
  }
}
// sample docs insert=============================================================

// Function to create a new booking
const createBooking = async (bookingData) => {
  try {
    const bookingRef = db.collection('bookings').doc() // Auto-generate ID
    const booking = {
      ...bookingData,
      bookingDate: new Date().toISOString(), // Current date when booking is created
    }
    await bookingRef.set(booking)
    return bookingRef.id
  } catch (error) {
    throw new Error(`Error creating booking: ${error.message}`)
  }
}

// Function to get a booking by ID
const getAllBookings = async () => {
  try {
    const bookingsSnapshot = await db.collection('bookings').get()

    if (bookingsSnapshot.empty) {
      return []
    }

    const bookings = []
    bookingsSnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() })
    })

    return bookings
  } catch (error) {
    throw new Error(`Error fetching bookings: ${error.message}`)
  }
}

// Function to get a booking by ID
const getBookingById = async (bookingId) => {
  try {
    const bookingRef = db.collection('bookings').doc(bookingId)
    const bookingDoc = await bookingRef.get()
    if (!bookingDoc.exists) {
      throw new Error('Booking not found')
    }
    return bookingDoc.data()
  } catch (error) {
    throw new Error(`Error fetching booking: ${error.message}`)
  }
}

// Function to update booking status or other fields
const updateBooking = async (bookingId, updatedData) => {
  try {
    const bookingRef = db.collection('bookings').doc(bookingId)
    await bookingRef.update(updatedData)
    return 'Booking updated successfully'
  } catch (error) {
    throw new Error(`Error updating booking: ${error.message}`)
  }
}

// Function to delete a booking
const deleteBooking = async (bookingId) => {
  try {
    const bookingRef = db.collection('bookings').doc(bookingId)
    await bookingRef.delete()
    return 'Booking deleted successfully'
  } catch (error) {
    throw new Error(`Error deleting booking: ${error.message}`)
  }
}

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  insertSampleDocs,
}
