
# Project README

## Table of Contents
1. [Overview](#overview)  
2. [Environment Variables](#environment-variables)  
3. [Error Handling: Transaction Failures](#error-handling-transaction-failures)  
4. [Refund Workflow Change](#refund-workflow-change)  
5. [Doctor Payment System](#doctor-payment-system)  
6. [Email Notification System](#email-notification-system)  
7. [Backend Optimizations](#backend-optimizations)  
8. [Frontend Optimizations](#frontend-optimizations)  
9. [VPS Cost Reduction Strategies](#vps-cost-reduction-strategies)  

---

## Overview
This repository implements a complete tele-health appointment platform:
- Custom transaction failure handling  
- Manual refund requests on doctor-cancelled slots  
- Doctor earnings tracking & manual payouts  
- Configurable email notifications  
- Performance optimizations (DB, API, UI)  
- VPS cost reduction best practices  

---

## Environment Variables

### Frontend

````
VITE_BACKEND_URL=[http://localhost:4000](http://localhost:4000)
VITE_RAZORPAY_KEY_ID=rzp_test_JMG83VGBFPgW6I


````
### Backend
```

PORT=4000

# Database credentials

MONGODB_URI=

JWT_SECRET=

# Cloudinary credentials

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=

# Razorpay credentials

RAZORPAY_KEY_ID=rzp_t
RAZORPAY_KEY_SECRET=

# Admin credentials

ADMIN_EMAIL=
ADMIN_PASSWORD=

# Email services (Nodemailer)

NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=

# Additional email (if needed)

EMAIL=
EMAIL_PASS=

```

### Admin
```

VITE_CURRENCY='₹'
VITE_BACKEND_URL='[http://localhost:4000](http://localhost:4000)'

```


## Error Handling: Transaction Failures
When a user’s payment transaction fails:
1. Detect the failure event from the payment gateway webhook.  
2. Display a clear, user-friendly error message:
   > **“Oops! Your payment could not be processed. Please check your card details or try another payment method.”**  
3. Log failure details for diagnostics.  
4. Allow the user to retry or select another payment option.

---

## Refund Workflow Change
**Current:** Automatic refund when a doctor cancels a slot.  
**New Requirement:**  
1. **User Notification**  
   > “Your appointment has been cancelled by Dr. **[Doctor Name]** due to unforeseen reasons.  
   > Your refund request will be activated and processed within **5–7 business days**.  
   > Thank you for your patience.”  
2. **Admin Interface**  
   - Create a **Refund Requests** entry on cancellation.  
   - Store user payment details securely at transaction time.  
   - Manual controls to set status:
     - **Refund Confirmed**  
     - **Refund Completed**  
   - Trigger refund via original payment method on confirmation.

---

## Doctor Payment System
Tracks and manages doctor earnings, with manual payouts and admin commission.

### 1. Earnings Tracking
- **Monthly Earnings** reset every **28 days**.  
- **Total Earnings** cumulative, non-resettable.

### 2. Admin Commission
- Configurable **commission percentage** per doctor or globally (e.g., 30%).

### 3. Manual Payout Processing
- Admin dashboard displays:
  - Monthly earnings  
  - Total earnings  
  - Admin’s share  
  - Amount due to doctor  
- Button to **“Mark as Paid”** / **“Transfer Completed”**.

### 4. ACID Compliance
Ensure **Atomicity**, **Consistency**, **Isolation**, and **Durability** for all transactions.

---

## Email Notification System
Automated emails for booking confirmations and reminders.

### On Booking
- **User:** Confirmation email.  
- **Doctor:** New appointment alert.  
- **Admin:** Record notification.

### Reminder Schedule (User Only)
For future appointments:
- **3 hours before**  
- **15 minutes before**  
- **5 minutes before**

Includes appointment details, reschedule/cancel links, and support info.

> Configurable timings via environment or admin panel.

---

## Backend Optimizations
1. **Query Caching** (Redis/in-memory).  
2. **Avoid N+1** with eager loading/joins.  
3. **Batch Operations**.  
4. **Pagination & Field Limiting**.  
5. **Debounce & Queues** for heavy tasks.  
6. **Indexing** on key fields.  
7. **Archive/Delete** old data.  
8. **Lazy Load** infrequent data.  
9. **API Rate Limiting**.  
10. **Production Logging**: error/warn only.

---

## Frontend Optimizations
1. **Debounce** input events.  
2. **Client Caching** (localStorage, React Query).  
3. **Code Splitting & Lazy Loading**:
   ```js
   const AppointmentHistory = React.lazy(() => import('./AppointmentHistory'));


4. **Minify & Compress** assets.
5. **Optimize Rerenders** with React.memo, useMemo, useCallback.
6. **Scoped State** over global where possible.

---

## VPS Cost Reduction Strategies

1. **Auto-scaling** & load-based scaling.
2. **Scheduled Downtime** via cron jobs.
3. **Containerization** with Docker.
4. **CDN** for static assets.
5. **Reverse Proxy** (Nginx) for SSL, compression, caching.

---



```
```
