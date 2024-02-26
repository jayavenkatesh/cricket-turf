const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/slot_booking_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define schema and model for slot bookings
const SlotBooking = mongoose.model('SlotBooking', {
    slotId: String,
    userId: String,
    paymentStatus: String
});

const app = express();
app.use(bodyParser.json());

// Define route to handle slot booking
app.post('/book-slot', async (req, res) => {
    try {
        const { slotId, userId } = req.body;

        // Check if slot is available
        const existingBooking = await SlotBooking.findOne({ slotId });
        if (existingBooking) {
            return res.status(400).send('Slot is already booked. Please try another slot.');
        }

        // If slot is available, create a new booking
        const newBooking = new SlotBooking({
            slotId,
            userId,
            paymentStatus: 'pending'
        });
        await newBooking.save();

        // Redirect to payment gateway (replace this with actual payment gateway integration)
        res.redirect('/payment');

    } catch (error) {
        console.error('Error booking slot:', error);
        res.status(500).send('An error occurred while booking the slot.');
    }
});

// Payment route (replace this with actual payment processing logic)
app.get('/payment', (req, res) => {
    // Placeholder for payment processing logic
    res.send('Payment processing...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
