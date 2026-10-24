# Kissan Rent

Agricultural machinery rental platform (FYP) - MERN Stack.

## Roles
- **Farmer:** machinery search, booking, booking cancel
- **Owner:** machinery add/manage, booking approve/reject/complete
- **Admin:** CNIC verification, stats dashboard

## Setup

### 1. Server
```bash
cd server
npm install
cp .env.example .env      # .env mein MONGO_URI aur JWT_SECRET likhein
npm run seed:admin        # admin account ban jayega
npm run dev               # http://localhost:5000
```

### 2. Client
```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

## Test karne ka tareeqa
1. Admin se login (email/password `.env` mein hai).
2. Do account register karein: ek owner, ek farmer.
3. Admin dashboard se dono ko Approve karein.
4. Owner: machinery add karein. Farmer: search kar ke booking karein.
5. Owner: booking approve karein, phir completed.

## TODO (Phase 2)
- [ ] Reviews and ratings
- [ ] Complaint system
- [ ] Notifications
- [ ] Recharts charts
- [ ] Cloudinary image upload
- [ ] Input validation (express-validator / Zod)
- [ ] Deployment (Vercel + Render + Atlas)
