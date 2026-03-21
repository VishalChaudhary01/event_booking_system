# Event Booking System

A `Mini Event Management System` where users can browse events and book tickets.

## How to Run (Using Docker)

### 1. Clone the repo

```bash
git clone https://github.com/VishalChaudhary01/event_booking_system.git
```

### 2. Navigate to project dir

```bash
cd event_booking_system
```

### 3. Setup environment variables

> Edit `.env` if needed

```bash
cp .env.example .env
```

### 4. Start everything

> Make sure Docker and Docker Compose are installed.

```bash
docker compose up --build
```

This will:

1. Pull the `mysql:8.0` image and start the database
2. Build the Node.js app image (`npm install` → `prisma generate` → `tsc`)
3. Wait for MySQL healthcheck to pass
4. Run `prisma migrate deploy` automatically
5. Start the API server on port `5000`

To run in background:

```bash
docker compose up --build -d
```

To stop:

```bash
docker compose down
```
