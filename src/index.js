require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const nodemailer = require('nodemailer');

// Initialize express app
const app = express();

// CORS Configuration
// Allow all origins in development, restrict in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-frontend-domain.com']
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
  preflightContinue: false, // Let CORS handle preflight
};

// Apply CORS to ALL routes - must be first middleware
// This automatically handles OPTIONS preflight requests for all routes
app.use(cors(corsOptions));

// Security headers - configured to work with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false, // Allow embedding if needed
}));

// Other middleware
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Booking notification endpoint
// CORS is already applied globally, so no need to add it here again
app.post('/api/booking-notify', async (req, res) => {
  try {
    const bookingData = req.body;

    // Validate required fields
    if (!bookingData.email || !bookingData.fullName) {
      return res.status(400).json({ 
        error: 'Missing required fields: email and fullName are required' 
      });
    }

    // Format email content
    const formatDate = (dateString) => {
      if (!dateString) return 'Not specified';
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #d4af37; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .section { margin-bottom: 20px; }
            .section-title { color: #1a1a2e; font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #d4af37; padding-bottom: 5px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; margin-left: 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Flight Booking Request</h1>
              <p>VMO AERO</p>
            </div>
            <div class="content">
              <div class="section">
                <div class="section-title">Contact Information</div>
                <div class="field">
                  <span class="label">Full Name:</span>
                  <span class="value">${bookingData.fullName || 'Not provided'}</span>
                </div>
                <div class="field">
                  <span class="label">Email:</span>
                  <span class="value">${bookingData.email || 'Not provided'}</span>
                </div>
                <div class="field">
                  <span class="label">Phone:</span>
                  <span class="value">${bookingData.phone || 'Not provided'}</span>
                </div>
                <div class="field">
                  <span class="label">Preferred Contact:</span>
                  <span class="value">${bookingData.preferredContact || 'Not specified'}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Trip Details</div>
                <div class="field">
                  <span class="label">Trip Type:</span>
                  <span class="value">${bookingData.tripType || 'Not specified'}</span>
                </div>
                <div class="field">
                  <span class="label">Departure:</span>
                  <span class="value">${bookingData.departure || 'Not specified'}</span>
                </div>
                <div class="field">
                  <span class="label">Arrival:</span>
                  <span class="value">${bookingData.arrival || 'Not specified'}</span>
                </div>
                <div class="field">
                  <span class="label">Departure Date & Time:</span>
                  <span class="value">${formatDate(bookingData.departureDateTime)}</span>
                </div>
                ${bookingData.returnDateTime ? `
                <div class="field">
                  <span class="label">Return Date & Time:</span>
                  <span class="value">${formatDate(bookingData.returnDateTime)}</span>
                </div>
                ` : ''}
                <div class="field">
                  <span class="label">Dates Flexible:</span>
                  <span class="value">${bookingData.datesFlexible === 'yes' ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Passenger Information</div>
                <div class="field">
                  <span class="label">Number of Passengers:</span>
                  <span class="value">${bookingData.passengers || 'Not specified'}</span>
                </div>
                ${bookingData.hasChildren === 'yes' ? `
                <div class="field">
                  <span class="label">Children:</span>
                  <span class="value">Yes (${bookingData.numberOfChildren || 0} children)</span>
                </div>
                ${bookingData.childrenAges ? `
                <div class="field">
                  <span class="label">Children Ages:</span>
                  <span class="value">${bookingData.childrenAges}</span>
                </div>
                ` : ''}
                <div class="field">
                  <span class="label">Child Seat/Bassinet Required:</span>
                  <span class="value">${bookingData.needsChildSeat === 'yes' ? 'Yes' : 'No'}</span>
                </div>
                ` : ''}
                ${bookingData.specialRequests ? `
                <div class="field">
                  <span class="label">Special Requests:</span>
                  <span class="value">${bookingData.specialRequests}</span>
                </div>
                ` : ''}
              </div>

              <div class="section">
                <div class="section-title">Aircraft & Purpose</div>
                <div class="field">
                  <span class="label">Preferred Aircraft:</span>
                  <span class="value">${bookingData.aircraft || 'Not specified'}</span>
                </div>
                <div class="field">
                  <span class="label">Purpose of Flight:</span>
                  <span class="value">${bookingData.purpose || 'Not specified'}</span>
                </div>
              </div>

              ${bookingData.userId ? `
              <div class="section">
                <div class="section-title">System Information</div>
                <div class="field">
                  <span class="label">User ID:</span>
                  <span class="value">${bookingData.userId}</span>
                </div>
                <div class="field">
                  <span class="label">Status:</span>
                  <span class="value">${bookingData.status || 'pending'}</span>
                </div>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>This is an automated notification from VMO AERO booking system.</p>
              <p>Please respond to the customer at: ${bookingData.email}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
New Flight Booking Request - VMO AERO

CONTACT INFORMATION
Full Name: ${bookingData.fullName || 'Not provided'}
Email: ${bookingData.email || 'Not provided'}
Phone: ${bookingData.phone || 'Not provided'}
Preferred Contact: ${bookingData.preferredContact || 'Not specified'}

TRIP DETAILS
Trip Type: ${bookingData.tripType || 'Not specified'}
Departure: ${bookingData.departure || 'Not specified'}
Arrival: ${bookingData.arrival || 'Not specified'}
Departure Date & Time: ${formatDate(bookingData.departureDateTime)}
${bookingData.returnDateTime ? `Return Date & Time: ${formatDate(bookingData.returnDateTime)}\n` : ''}
Dates Flexible: ${bookingData.datesFlexible === 'yes' ? 'Yes' : 'No'}

PASSENGER INFORMATION
Number of Passengers: ${bookingData.passengers || 'Not specified'}
${bookingData.hasChildren === 'yes' ? `Children: Yes (${bookingData.numberOfChildren || 0} children)\n` : ''}
${bookingData.childrenAges ? `Children Ages: ${bookingData.childrenAges}\n` : ''}
${bookingData.needsChildSeat === 'yes' ? `Child Seat/Bassinet Required: Yes\n` : ''}
${bookingData.specialRequests ? `Special Requests: ${bookingData.specialRequests}\n` : ''}

AIRCRAFT & PURPOSE
Preferred Aircraft: ${bookingData.aircraft || 'Not specified'}
Purpose of Flight: ${bookingData.purpose || 'Not specified'}

${bookingData.userId ? `User ID: ${bookingData.userId}\nStatus: ${bookingData.status || 'pending'}\n` : ''}

Please respond to the customer at: ${bookingData.email}
    `.trim();

    // Send email
    const mailOptions = {
      from: `"VMO AERO Booking System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to admin email
      replyTo: bookingData.email, // Allow reply directly to customer
      subject: `New Flight Booking Request from ${bookingData.fullName}`,
      text: emailText,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Booking notification email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending booking notification email:', error);
    res.status(500).json({ 
      error: 'Failed to send booking notification email',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
