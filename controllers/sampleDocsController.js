// controllers/bookingController.js

const bookingModel = require('../models/bookingModel')
const admin = require('../config/firebase-admin')
const db = admin.firestore()

// fake inserts====================================================
const fakeRooms = [{ id: 1, number: '101', type: 'Single', status: 'active' }]
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
