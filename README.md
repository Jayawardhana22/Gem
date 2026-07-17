# Ceylon Gem Atelier — Full-Stack Gem Marketplace

A modern gem buy/sell marketplace: **.NET 8 Web API** backend (SQL Server, Identity, JWT,
Stripe) + **React + TypeScript + Three.js** frontend with a 3D rotating gem hero.

```
gem-marketplace/
├── backend/GemMarketplace.API/   # .NET 8 Web API
└── frontend/                     # React + Vite + TypeScript
```

---

## 1. Backend setup (.NET 8 Web API)

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- SQL Server (LocalDB, Express, Docker, or full SQL Server)
- `dotnet-ef` tool: `dotnet tool install --global dotnet-ef`

### Steps
```bash
cd backend/GemMarketplace.API

# Restore packages
dotnet restore

# Update appsettings.json:
#   - ConnectionStrings:DefaultConnection -> your SQL Server connection string
#   - Jwt:Key                            -> a long random secret (32+ chars)
#   - Stripe:SecretKey / PublishableKey  -> your Stripe test keys (https://dashboard.stripe.com/test/apikeys)

# Create the initial EF Core migration
dotnet ef migrations add InitialCreate

# Run the API (this also applies migrations + seeds data automatically on startup)
dotnet run
```

The API starts on `https://localhost:5001` (Swagger UI at `/swagger`).

**Seeded admin login:** `admin@ceylongems.local` / `Admin@12345` (change this immediately after first login).

### Quick Docker SQL Server (optional, if you don't have SQL Server installed)
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong!Passw0rd" \
  -p 1433:1433 --name gem-sql -d mcr.microsoft.com/mssql/server:2022-latest
```

---

## 2. Frontend setup (React + Vite + Three.js)

### Prerequisites
- Node.js 18+

### Steps
```bash
cd frontend

# Copy and fill in environment variables
cp .env.example .env
#   VITE_API_URL=https://localhost:5001/api
#   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

npm install
npm run dev
```

The site runs on `http://localhost:5173`.

---

## 3. Stripe webhook (for payment confirmation)

Payments are confirmed via a webhook that marks orders as `Paid` and gems as `Sold`.
For local testing, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to https://localhost:5001/api/payments/webhook
```

Copy the printed webhook signing secret into `Stripe:WebhookSecret` in `appsettings.json`.

---

## 4. What's included

**Backend**
- ASP.NET Core Identity (JWT auth, Admin/Customer roles)
- Gem catalog with categories, images, filtering, sorting, search
- Cart, order creation, Stripe PaymentIntents + webhook
- Full admin API: gem CRUD + image upload, order status management, dashboard stats
- EF Core + SQL Server, auto-migration & seed on startup

**Frontend**
- 3D rotating, faceted gem hero (react-three-fiber / Three.js) on the homepage
- Shop with category/price/carat filters and sorting
- Gem detail page, cart, full checkout flow with Stripe Elements
- Auth (login/register), order history
- Admin dashboard: stats, gem management with photo upload, order status updates
- Distinct visual identity: charcoal/sapphire/gold palette, faceted-cut motif used for
  card borders, buttons, and dividers; Fraunces display type + Inter body type

## 5. Suggested next steps
- Add product image zoom / 360° gem photography on the detail page
- Add email notifications (order confirmation, shipping updates) via SendGrid or SMTP
- Add a wishlist / saved-gems feature
- Deploy: backend to Azure App Service / Railway, frontend to Vercel/Netlify, DB to Azure SQL
- Add rate limiting + reCAPTCHA on register/login for production hardening
"# Gem" 
