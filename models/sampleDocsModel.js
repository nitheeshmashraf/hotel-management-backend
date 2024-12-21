// models/bookingModel.js

const admin = require('../config/firebase-admin')
const db = admin.firestore()

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

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  insertSampleDocs,
}
