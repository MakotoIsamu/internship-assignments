const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// MongoDB Connection
const dbURI = 'mongodb+srv://assignment:abcdefgh@cluster0.72a4p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('connected', () => console.log('MongoDB connected successfully'));
db.on('error', (err) => console.log('MongoDB connection error:', err));

// Appointment Model
const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  doctor: String,
  date: String,
  time: String,
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Appointment Scheduler API');
});

// Create Appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
});

// Get All Appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

// Delete Appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
