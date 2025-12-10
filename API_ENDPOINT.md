# Booking Notification API Endpoint

## Endpoint Details

**URL:** `http://localhost:3000/api/booking-notify`  
**Method:** `POST`  
**Content-Type:** `application/json`

---

## Required Fields

- `fullName` (string) - Customer's full name
- `email` (string) - Customer's email address

---

## Request Body Structure

```json
{
  "userId": "string (optional)",
  "fullName": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "preferredContact": "string (optional) - 'email', 'phone', or 'whatsapp'",
  "tripType": "string (optional) - 'dropoff', 'dropandwait', 'pickup', or 'other'",
  "departure": "string (optional)",
  "arrival": "string (optional)",
  "departureDateTime": "string (optional) - ISO format: 'YYYY-MM-DDTHH:mm'",
  "returnDateTime": "string (optional) - ISO format: 'YYYY-MM-DDTHH:mm'",
  "datesFlexible": "string (optional) - 'yes' or 'no'",
  "passengers": "number (optional)",
  "hasChildren": "string (optional) - 'yes' or 'no'",
  "numberOfChildren": "number (optional)",
  "childrenAges": "string (optional)",
  "needsChildSeat": "string (optional) - 'yes' or 'no'",
  "specialRequests": "string (optional)",
  "aircraft": "string (optional)",
  "purpose": "string (optional) - 'business', 'leisure', 'medical', or 'other'",
  "status": "string (optional) - defaults to 'pending'"
}
```

---

## Usage Examples

### JavaScript/React (Fetch API)

```javascript
const apiUrl = 'http://localhost:3000'; // or your production URL

const bookingData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  preferredContact: 'email',
  tripType: 'dropoff',
  departure: 'London Heathrow (LHR)',
  arrival: 'John F. Kennedy International (JFK)',
  departureDateTime: '2024-12-25T10:00',
  passengers: 2,
  hasChildren: 'no',
  aircraft: 'Gulfstream G650',
  purpose: 'business'
};

fetch(`${apiUrl}/api/booking-notify`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(bookingData),
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    // { success: true, message: 'Booking notification email sent successfully' }
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### JavaScript/React (Async/Await)

```javascript
const apiUrl = 'http://localhost:3000';

async function sendBookingNotification(bookingData) {
  try {
    const response = await fetch(`${apiUrl}/api/booking-notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Email sent successfully:', result);
      return result;
    } else {
      console.error('Error:', result);
      throw new Error(result.error || 'Failed to send notification');
    }
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
}

// Usage
const bookingData = {
  fullName: 'Jane Smith',
  email: 'jane.smith@example.com',
  tripType: 'dropoff',
  departure: 'LHR',
  arrival: 'JFK',
  departureDateTime: '2024-12-25T14:30',
  passengers: 1,
  hasChildren: 'no',
  purpose: 'business'
};

sendBookingNotification(bookingData);
```

### Axios (React)

```javascript
import axios from 'axios';

const apiUrl = 'http://localhost:3000';

const bookingData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  // ... other fields
};

axios.post(`${apiUrl}/api/booking-notify`, bookingData)
  .then(response => {
    console.log('Success:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message);
  });
```

### cURL

```bash
curl -X POST http://localhost:3000/api/booking-notify \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "tripType": "dropoff",
    "departure": "LHR",
    "arrival": "JFK",
    "departureDateTime": "2024-12-25T10:00",
    "passengers": 2,
    "hasChildren": "no",
    "purpose": "business"
  }'
```

### Python (requests)

```python
import requests

api_url = 'http://localhost:3000/api/booking-notify'

booking_data = {
    'fullName': 'John Doe',
    'email': 'john.doe@example.com',
    'phone': '+1234567890',
    'tripType': 'dropoff',
    'departure': 'LHR',
    'arrival': 'JFK',
    'departureDateTime': '2024-12-25T10:00',
    'passengers': 2,
    'hasChildren': 'no',
    'purpose': 'business'
}

response = requests.post(api_url, json=booking_data)
print(response.json())
```

---

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "message": "Booking notification email sent successfully"
}
```

### Error Response (400)

```json
{
  "error": "Missing required fields: email and fullName are required"
}
```

### Error Response (500)

```json
{
  "error": "Failed to send booking notification email",
  "message": "Error details here"
}
```

---

## Environment Variables

Make sure your `.env` file contains:

```
EMAIL_USER=vmoaeronigltd@gmail.com
EMAIL_PASS=your-app-password-here
PORT=3000
```

---

## Production URL

When deploying, replace `http://localhost:3000` with your production server URL:

- Example: `https://your-api-domain.com/api/booking-notify`

---

## Notes

- The endpoint sends an email notification to the admin email (`EMAIL_USER`)
- The email includes all booking details in a formatted HTML template
- The reply-to address is set to the customer's email for easy responses
- All fields except `fullName` and `email` are optional
- The endpoint is CORS-enabled, so it can be called from any frontend application

