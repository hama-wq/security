// server/server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser'); // To parse JSON bodies
const { sendOtp } = require('./sendOtp');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3002; // Backend now listens on port 3002

// CORS configuration – adjust origin as needed
const corsOptions = {
  origin: 'http://localhost:3000',  // Frontend runs on port 3000
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Serve translation files if needed
app.use('/locales', express.static(path.join(__dirname, 'locales')));

// API endpoint to check if a phone number is already registered
app.post('/api/check-phone', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: "Phone number is required" });
  }
  // Create an admin Supabase client using the service key
  const serviceKey = process.env.SUPABASE_SERVICE_KEY; // Set this in your server/.env file
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);
  try {
    // Use the admin API to list users filtered by phone number.
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ filter: `phone.eq.${phone}` });
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    // If users exist with this phone, return an error
    if (data?.users && data.users.length > 0) {
      return res.status(400).json({ success: false, error: "Phone number is already registered" });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API endpoint to send OTP
app.post('/api/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: "Phone number is required" });
  }
  try {
    const status = await sendOtp(phone);
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root endpoint for server status
app.get('/', (req, res) => {
  res.send('Translation server is running!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
