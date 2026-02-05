# Online Church Database & Management System (Prototype)

A simple, secure, and cost-effective MVP built with:
- Node.js + Express
- MySQL
- JWT authentication + bcrypt hashing
- HTML/CSS/Vanilla JS + Bootstrap

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create database schema:
   ```bash
   mysql -u <user> -p < sql/schema.sql
   ```
4. Run server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000`

## Key Features

- Admin/member role-based login
- Admin can create/update/deactivate members
- Search members by name/email/phone
- Record contributions + simulated SMS log + `sms_sent=true`
- Manage welfare requests
- Member profile, contribution history, welfare records
- Basic report endpoint: `GET /api/admin/reports`

## Project Structure

```
.
├── public/
│   ├── css/
│   ├── js/
│   └── views/
├── sql/
│   └── schema.sql
└── src/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    └── server.js
```
