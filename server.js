const express = require('express')
const bodyParser = require('body-parser')
const admin = require('./config/firebase-admin') // Firebase Admin SDK setup
const bookingRoutes = require('./routes/bookingRoutes')

const app = express()
const port = 8000

app.use(bodyParser.json()) // Parse JSON bodies
app.use('/bookings', bookingRoutes)

// Middleware to verify Firebase ID token
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] // Get token from Authorization header

  if (!token) {
    return res.status(401).send('Authorization token missing')
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken // Attach decoded user info to the request
    next()
  } catch (error) {
    return res.status(401).send('Unauthorized')
  }
}

// Sample route to get user profile (protected)
app.get('/profile', authenticate, async (req, res) => {
  const userId = req.user.uid

  try {
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .get()

    if (!userDoc.exists) {
      return res.status(404).send('User not found')
    }

    res.status(200).json(userDoc.data())
  } catch (error) {
    res.status(500).send('Error fetching user profile')
  }
})

// Route to register a new user (using Firebase Authentication)
app.post('/signup', async (req, res) => {
  const { email, password, name } = req.body

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    })

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      name: userRecord.displayName,
      role: 'guest', // Default role
    })

    res.status(201).send('User created')
  } catch (error) {
    res.status(500).send('Error creating user: ' + error.message)
  }
})

// Route to login (verify Firebase token)
app.post('/login', async (req, res) => {
  const { token } = req.body

  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    res.status(200).json({ message: 'Login successful', user: decodedToken })
  } catch (error) {
    res.status(401).send('Invalid token')
  }
})

// Route to create a new room (admin only)
app.post('/rooms', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Only admins can create rooms')
  }

  const { type, price, available } = req.body

  try {
    const roomRef = await admin.firestore().collection('rooms').add({
      type,
      price,
      available,
    })

    res.status(201).send(`Room created with ID: ${roomRef.id}`)
  } catch (error) {
    res.status(500).send('Error creating room: ' + error.message)
  }
})

// Route to get room details
app.get('/rooms', async (req, res) => {
  try {
    const roomsSnapshot = await admin.firestore().collection('rooms').get()
    const rooms = roomsSnapshot.docs.map((doc) => doc.data())
    res.status(200).json(rooms)
  } catch (error) {
    res.status(500).send('Error fetching rooms: ' + error.message)
  }
})

// Route to create a booking
app.post('/bookings', authenticate, async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body

  try {
    const bookingRef = await admin.firestore().collection('bookings').add({
      userId: req.user.uid,
      roomId,
      checkInDate,
      checkOutDate,
      status: 'pending', // Default booking status
    })

    res.status(201).send(`Booking created with ID: ${bookingRef.id}`)
  } catch (error) {
    res.status(500).send('Error creating booking: ' + error.message)
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
