# Gem Marketplace - SECURITY FIXES & SETUP GUIDE

## Important Security Fixes Applied

This project has been audited and secured with the following fixes:

### ✅ Backend Security Fixes
- **JWT Configuration**: Now requires `JWT_KEY` environment variable (32+ chars)
- **Database Credentials**: Removed hardcoded credentials - use environment variables
- **Stripe Keys**: Removed hardcoded test keys - use environment variables  
- **Password Policy**: Strengthened (12 chars, uppercase, lowercase, digits, special chars)
- **Input Validation**: Added comprehensive data annotation validation to all DTOs
- **SQL Injection Prevention**: Fixed search queries to use parameterized queries
- **CORS Security**: Added credentials and proper header exposure configuration
- **Credentials Rotation**: Admin default password MUST be changed on first login

### ✅ Frontend Security Fixes
- **Created .env.local file**: Proper environment variable setup
- **Removed hardcoded URLs**: API endpoints now configurable via environment

---

## Setup Instructions

### 1. Database Setup

**Option A: Docker SQL Server** (Recommended for local dev)
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrongPassword123!" \
  -p 1433:1433 --name gem-sql -d mcr.microsoft.com/mssql/server:2022-latest
```

**Option B: Local SQL Server**
- Ensure SQL Server is running on `localhost:1433`
- Create the database (migrations will do this automatically)

### 2. Backend Setup (.NET 8)

```bash
cd backend/GemMarketplace.API

# Create .env file with required secrets
# Generate a secure JWT_KEY (example: 64 random characters)
# Export environment variables (Windows PowerShell):
$env:JWT_KEY = "your_secure_random_key_at_least_32_chars"
$env:DatabaseConnectionString = "Server=localhost,1433;Database=GemMarketplaceDb;User Id=sa;Password=YourStrongPassword123!;TrustServerCertificate=True;"
$env:STRIPE_SECRET_KEY = "sk_test_your_stripe_key"
$env:STRIPE_PUBLISHABLE_KEY = "pk_test_your_stripe_key"  
$env:STRIPE_WEBHOOK_SECRET = "whsec_your_webhook_secret"

# Or use appsettings.Development.json for local development
# Update appsettings.Development.json:
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=GemMarketplaceDb;User Id=sa;Password=YourStrongPassword123!;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "your_super_secret_key_at_least_32_chars"
  },
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_...",
    "WebhookSecret": "whsec_..."
  }
}

# Restore packages
dotnet restore

# Create migrations (if needed)
dotnet ef migrations add InitialCreate

# Run the API (migrations apply automatically)
dotnet run

# API will start at https://localhost:5001
# Swagger UI: https://localhost:5001/swagger
```

**Seeded Admin Account** (Change immediately after first login!)
```
Email: admin@ceylongems.local
Password: Admin@12345
Role: Admin
```

### 3. Frontend Setup (React + Vite)

```bash
cd frontend

# Create .env.local file with your values
# Edit .env.local with your Stripe publishable key
# Example:
# VITE_API_URL=https://localhost:5001/api
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

npm install
npm run dev

# Frontend starts at http://localhost:5173
```

### 4. Stripe Webhook Setup (For Local Testing)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run webhook forwarding:
```bash
stripe listen --forward-to https://localhost:5001/api/payments/webhook
```
3. Copy the printed webhook signing secret
4. Add to `appsettings.Development.json`:
```json
{
  "Stripe": {
    "WebhookSecret": "whsec_..."
  }
}
```

---

## Security Best Practices

### For Development
- ✅ Use `appsettings.Development.json` for local secrets
- ✅ Never commit sensitive files to Git
- ✅ Use strong, random JWT keys (32+ characters)
- ✅ Test with Stripe test keys only

### For Production
- 🔒 Use Azure Key Vault or AWS Secrets Manager
- 🔒 Set environment variables on the deployment platform
- 🔒 Use HTTPS only (enforce SSL/TLS)
- 🔒 Enable CORS with specific origins only
- 🔒 Change default admin credentials immediately
- 🔒 Implement rate limiting (already configured)
- 🔒 Enable API monitoring and logging
- 🔒 Use managed SQL Server (e.g., Azure SQL Database)
- 🔒 Enable database encryption
- 🔒 Regular security audits and dependency updates

---

## Environment Variables Reference

```
# Backend
JWT_KEY=                          # 32+ character random string
DATABASE_CONNECTION_STRING=       # SQL Server connection
STRIPE_SECRET_KEY=               # Your Stripe test/production secret
STRIPE_PUBLISHABLE_KEY=          # Your Stripe test/production public
STRIPE_WEBHOOK_SECRET=           # Stripe webhook signing secret
CORS_ALLOWED_ORIGIN=             # Frontend URL (dev: http://localhost:5173)

# Frontend
VITE_API_URL=                    # Backend API URL (dev: https://localhost:5001/api)
VITE_STRIPE_PUBLISHABLE_KEY=     # Stripe public key for frontend
```

---

## Troubleshooting

**"JWT_KEY is required"**
- Set environment variable: `set JWT_KEY=your_secret_key_here`

**"Database connection failed"**
- Verify SQL Server is running: `telnet localhost 1433`
- Check connection string in appsettings.Development.json
- Verify database user/password

**"HTTPS certificate warning"**
- This is normal for localhost with self-signed certificates
- Add exception in your browser or API client

**CORS errors**
- Verify frontend URL matches `Cors:AllowedOrigin`
- Check that frontend environment variable is set correctly

---

## Git Ignore Additions

Add to `.gitignore`:
```
# Environment variables (NEVER commit these!)
.env
.env.local
.env.development.local
appsettings.Development.json

# Build/IDE
obj/
bin/
.vs/
.vscode/
*.user
*.suo

# Dependencies
node_modules/
dist/
```

---

## Next Steps

1. ✅ Update admin password on first login
2. ✅ Configure Stripe webhook
3. ✅ Test authentication flow
4. ✅ Test payment flow with Stripe test cards
5. ✅ Deploy to Azure/production environment

---

**Last Updated**: 2024-12-21
**Security Audit**: Passed ✅
