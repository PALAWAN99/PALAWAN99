# Production Smoke Test Checklist

## 1. Core Platform
- [ ] Application loads at production URL
- [ ] HTTPS is active and certificate is valid
- [ ] Health check endpoint `/api/health` returns 200 OK

## 2. Authentication
- [ ] Admin login with correct credentials
- [ ] Admin login fails with incorrect credentials
- [ ] Session persists across page refreshes
- [ ] Unauthorized users cannot access `/admin`

## 3. Member Management
- [ ] Can view member list
- [ ] Can create a test member
- [ ] QR Code generation for member works

## 4. Gate Operations
- [ ] Real-time dashboard updates (if applicable)
- [ ] Manual gate trigger works (if implemented)
- [ ] Access logs are recording events

## 5. Exports
- [ ] PDF export generates and downloads
- [ ] Excel export generates and downloads

## 6. System
- [ ] No sensitive environment variables leaked in client bundle
- [ ] Rate limiting triggers after multiple failed attempts
- [ ] Database migrations are up to date
