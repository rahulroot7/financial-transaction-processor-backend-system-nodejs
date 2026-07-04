# Backend System - Node.js

An event-driven backend system built using **Node.js**, **Express.js**, **MongoDB**, and **RabbitMQ** to process high-volume financial webhook events.

The application ensures reliable transaction processing using idempotency, asynchronous workers, retry mechanisms, and ledger management.

---

## Features

- Webhook API
- SHA-256 Idempotency
- RabbitMQ Queue Processing
- MongoDB Storage
- Ingest Worker
- Enrichment Worker
- Ledger Worker
- Batch Processing
- Retry Mechanism
- Structured Logging

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- RabbitMQ
- Mongoose
- Pino Logger

---

## Project Structure

```
backend-system/
│
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── queues
│   ├── routes
│   ├── services
│   ├── utils
│   ├── workers
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

## System Architecture

```
Webhook API
      │
      ▼
Idempotency Check
      │
      ▼
MongoDB (webhook_events)
      │
      ▼
RabbitMQ
      │
      ▼
Ingest Worker
      │
      ▼
MongoDB (transactions)
      │
      ▼
Enrichment Worker
      │
      ▼
MongoDB (enriched transactions)
      │
      ▼
Ledger Worker
      │
      ▼
MongoDB (ledger_entries)
      │
      ▼
MongoDB (accounts)
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/rahulroot7/financial-transaction-processor-backend-system-nodejs.git

cd backend-system-nodejs
```

### Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file.

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/backend_system

RABBITMQ_URI=amqp://localhost

WEBHOOK_SECRET=mysecret

LOG_LEVEL=info
```

---

## Start RabbitMQ

```bash
docker run -d --name rabbitmq \
-p 5672:5672 \
-p 15672:15672 \
rabbitmq:3-management
```

RabbitMQ Dashboard

```
http://localhost:15672
```

Username

```
guest
```

Password

```
guest
```

---

## Start API

```bash
npm run dev
```

---

## Start Workers

### Ingest Worker

```bash
npm run worker:ingest
```

### Enrichment Worker

```bash
npm run worker:enrichment
```

### Ledger Worker

```bash
npm run worker:ledger
```

---

## API

### POST

```
/api/webhooks
```

Example Request

```json
{
    "eventId": "evt_1001",
    "accountId": "ACC001",
    "transactions": [
        {
            "transactionId": "TXN001",
            "amount": 100,
            "type": "CREDIT",
            "timestamp": "2026-07-03T10:00:00Z"
        }
    ]
}
```

---

## Database Collections

- webhookevents
- transactions
- ledgerentries
- accounts

---

## Queue Flow

```
Webhook API
      │
      ▼
ingest_queue
      │
      ▼
Ingest Worker
      │
      ▼
enrichment_queue
      │
      ▼
Enrichment Worker
      │
      ▼
ledger_queue
      │
      ▼
Ledger Worker
```

---

## Author

Rahul Chaurasia
