// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/driverDispatcherDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Define a schema for the form data
const formDataSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  licenseNumber: String,
  vehicleType: String,
  availabilityStatus: String,
  rating: Number
});

const FormData = mongoose.model('FormData', formDataSchema);

// Express routes
app.post('/api/submitFormData', async (req, res) => {
  try {
    const formData = req.body;
    const newFormData = new FormData(formData);
    await newFormData.save();
    res.status(201).json(newFormData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all form data
app.get('/api/getFormData', async (req, res) => {
    try {
      const formDatas = await FormData.find().sort({ rating: -1 }); // -1 for descending order
      res.status(200).json(formDatas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Route to delete a form data document
// In your delete route
app.delete('/api/deleteFormData/:id', async (req, res) => {
  try {
    const result = await FormData.findOneAndDelete({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: 'The driver with the given ID was not found.' });
    }
    res.json(result);
  } catch (err) {
    console.error("Error during deletion:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a form data document
app.put('/api/updateFormData/:id', async (req, res) => {
  try {
    const updatedData = req.body;
    const result = await FormData.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!result) {
      return res.status(404).json({ message: 'The driver with the given ID was not found.' });
    }
    res.json(result);
  } catch (err) {
    console.error("Error during update:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/api/getFormData/:id', async (req, res) => {
  try {
    const driver = await FormData.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
  


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
