# Tech Assessment, Order Management System

This repo contains two apps that run together via Docker Compose:

- `frontend/`, React + Vite
- `backend/`, Ruby on Rails API-only

The goal of this submission is to implement a **simple Order Management System** following an **MVCS** style (Model, View, Controller, Service).

## What was built

### Backend
- Orders CRUD API
- Sends an email after an order is created (ActionMailer + ActiveJob)

### Frontend
- Dashboard with a stat: **number of orders created**
- Orders table
- “New Order” button + dialog
- Refreshes the list (and stat) after creating a new order

## Prerequisites
- Docker
- Docker Compose
- `make`

## Quick start

### 1) Build and start everything
```bash
make build
```

### 2) Initialize the database (recommended on first run)
This will create/migrate the database and can also insert initial data so the table isn’t empty.

```bash
make db.init
```

If you want a populated orders table for demo purposes, run the DB init step above.

## URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Useful commands
- Start services:
  ```bash
  make start
  ```

- Stop services:
  ```bash
  make stop
  ```

- Run migrations:
  ```bash
  make db.migrate
  ```

- Rails console:
  ```bash
  make rails.c
  ```

- Shell inside containers:
  ```bash
  make sh
  ```

## API endpoints

### List orders (pagination)
```bash
curl "http://localhost:3000/orders?page=1&per=20"
```

### Stats (dashboard)
```bash
curl "http://localhost:3000/orders/stats"
```

### Create order
```bash
curl -X POST "http://localhost:3000/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "order": {
        "title": "Marketplace order #126",
        "status": 0,
        "total_cents": 25990,
        "currency": "USD",
        "notify_email": "ops@example.com",
        "reference_type": "inventory_aceup",
        "reference_id": "aceup-125",
        "metadata": {
            "channel": "marketplace",
            "notes": "leave at door"
        }
    }
}'
```

## Notes on email delivery
Email sending is implemented via **ActionMailer** and enqueued via **ActiveJob** (`deliver_later`).
In development, delivery may be configured to log/local delivery unless SMTP is configured.

## Running tests (backend)
```bash
cd backend
bundle exec rails test
```
