# Inventory & Order Management Backend

This is a Django + MongoDB backend for an Admin-only inventory/order management system.

## Features
- Admin authentication (email/password)
- Product management (CRUD, stock, status)
- Customer management (CRUD)
- Order management (multi-product, status lifecycle, stock deduction)
- Dashboard metrics (orders this month, revenue, top products, low stock warnings)

## Tech Stack
- Django
- Djongo (MongoDB integration)
- Django REST Framework

## Setup
1. Create and activate virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate
   ```
2. Install dependencies:
   ```powershell
   pip install django djongo djangorestframework
   ```
3. Run migrations and start server:
   ```powershell
   python manage.py migrate
   python manage.py runserver
   ```

## Configuration
- Set your MongoDB connection in `core/settings.py` under `DATABASES`.

---

For API endpoints and model details, see code and comments.
