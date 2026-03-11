# StockWise API

A simple REST API for inventory management built with NestJS. Track products, monitor stock levels, and get alerts for low-stock items.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Database**: SQLite (via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3))
- **Language**: TypeScript

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

## Getting Started

```bash
# Clone the repository
git clone https://github.com/omeliiii/stockwise-api.git
cd stockwise-api

# Install dependencies
npm install

# Start the development server
npm run start:dev
```

The API will be available at `http://localhost:3000`.

> No database setup is required — SQLite creates a local `stockwise.db` file automatically on first run.

## API Endpoints

### Products

| Method   | Endpoint               | Description                          |
| -------- | ---------------------- | ------------------------------------ |
| `GET`    | `/products`            | Get all products                     |
| `GET`    | `/products/low-stock`  | Get products below minimum threshold |
| `GET`    | `/products/:id`        | Get a single product by ID           |
| `POST`   | `/products`            | Create a new product                 |
| `PATCH`  | `/products/:id`        | Update a product                     |
| `DELETE` | `/products/:id`        | Delete a product                     |

### Example Requests

**Create a product**

```bash
curl -X POST http://localhost:3000/products \
  -H 'Content-Type: application/json' \
  -d '{"name": "Widget", "quantity": 5, "minThreshold": 10}'
```

```json
{
  "name": "Widget",
  "quantity": 5,
  "minThreshold": 10,
  "id": 1
}
```

**Get all products**

```bash
curl http://localhost:3000/products
```

**Get a single product**

```bash
curl http://localhost:3000/products/1
```

**Update a product**

```bash
curl -X PATCH http://localhost:3000/products/1 \
  -H 'Content-Type: application/json' \
  -d '{"quantity": 20}'
```

**Get low-stock products**

Returns all products where `quantity < minThreshold`.

```bash
curl http://localhost:3000/products/low-stock
```

**Delete a product**

```bash
curl -X DELETE http://localhost:3000/products/1
```

## Project Structure

```
src/
├── app.module.ts                  # Root module with TypeORM config
├── main.ts                        # Application entry point
└── products/
    ├── dto/
    │   ├── create-product.dto.ts   # DTO for creating products
    │   └── update-product.dto.ts   # DTO for updating products
    ├── product.entity.ts           # TypeORM entity
    ├── products.controller.ts      # REST controller
    ├── products.module.ts          # Feature module
    └── products.service.ts         # Business logic
```

## License

[MIT](LICENSE)
