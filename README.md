## WomXchange Rwanda: E-Commerce Platform for Women Entrepreneurs

# Description
WomXchange Rwanda is a free and easy-to-use online platform designed to help women entrepreneurs in Kigali sell their products, manage orders, and grow their businesses. It provides simple tools for both sellers and buyers, including a chatbot for support, product management, order tracking, and an integrated payment system via MoMoPay (Mobile Money). The platform supports both English and Kinyarwanda, making it more accessible to a wide range of users.

# Programming Language Used

1. Backend: Python (Django)
2. Frontend: JavaScript (React)

# Database

PostgreSQL: A powerful, open-source relational database used to store data such as user information, products, orders, and payments.

# Basic Features

1. Seller Dashboard:

Add, update, and manage product listings.

Track and manage orders (pending, fulfilled, cancelled).

View sales performance and trends.

Chatbot for assistance with product and order management.

Buyer Dashboard:

View and track orders.

Save products in the wishlist for future purchase.

Manage personal details, delivery addresses, and payment methods.

Chatbot support for order tracking, product queries, etc.

2. Admin Dashboard:

Manage seller registration (approve/reject sellers).

Monitor product listings and flagged items.

Generate sales and performance reports.

3. Chatbot:

A fixed, floating component that provides product suggestions, order tracking, and answers to frequently asked questions.

4. Payment Integration:

Supports MoMoPay for payments through the MTN MoMo API.

5. Language Support:

Available in both English and Kinyarwanda.

# Author

Beritha Niyotwagira
Fullstack Developer
Email: nberitha12@gmail.com 
GitHub: https://github.com/Beritha-n12

# Installation

Dependencies Installed

# Frontend Dependencies (React)
Below are the necessary dependencies for the frontend (React):

1. React
Core library for building user interfaces.
```
npm install react react-dom
```

2. Next.js

Framework for routing and server-side rendering (SSR).
```
npm install next
```
3. Tailwind CSS

Utility-first CSS framework for building custom UI components.
```
npm install tailwindcss postcss autoprefixer
```
4. Axios
For making HTTP requests to the backend API.
```
npm install axios
```
5. React-Router

For routing in React applications.
```
npm install react-router-dom
```
6. Formik & Yup
For handling forms and form validation.
```
npm install formik yup
```
7. React-Query

For data fetching and caching.
```
npm install react-query
```
8. React-Toastify

For displaying toast notifications.
```
npm install react-toastify
```
9. React-I18Next
For multilingual support (English and Kinyarwanda).
```
npm install react-i18next i18next
```
10. React-Icons
For icons in UI components.
```
npm install react-icons
```
11. Redux or Zustand

For state management (optional).
```
npm install redux
```
12. Darkmode Toggle
For implementing dark/light mode switching.
```
npm install darkmode-toggle
```

# Backend Dependencies (Django)
Below are the necessary dependencies for the backend (Django):

1. Django
Web framework for building the backend.
```
pip install django
```
2. Django REST Framework

For building RESTful APIs.
```
pip install djangorestframework
```
3. PostgreSQL
Database for storing data.
```
pip install psycopg2-binary
```

4. dj-database-url
For configuring the PostgreSQL database URL.
```
pip install dj-database-url
```
5. django-cors-headers
For enabling CORS (Cross-Origin Resource Sharing).
```
pip install django-cors-headers
```
6. python-decouple
For managing environment variables.
```
pip install python-decouple
```
7. dj-rest-auth
For authentication APIs (login, registration, etc.).
```
pip install dj-rest-auth
```
8. djangorestframework-simplejwt
For JWT authentication.
```
pip install djangorestframework-simplejwt
```
9. django-filter
For filtering querysets in Django views.
```
pip install django-filter
```
10. drf-yasg
For generating Swagger API documentation.
```
pip install drf-yasg
```
11. django-crispy-forms
For rendering forms with Bootstrap-friendly HTML.
```
pip install django-crispy-forms
```
12. django-storages
For handling media file storage.
```
pip install django-storages
```
13. Celery & Redis
For handling asynchronous tasks (e.g., email notifications, order processing).
```
pip install celery redis
```
14. Whitenoise
For serving static files in production.
```
pip install whitenoise
```
15. MTN MoMo API
For integrating MTN MoMoPay for payments.
```
pip install mtn-momo-api
```
15. pytest
For testing APIs and functionalities.
```
pip install pytest
```
16. django-extensions
For extra management commands.
```
pip install django-extensions
```
17. django-helmet
For adding secure HTTP headers.
```                                      
pip install django-helmet
```
18. django-debug-toolbar
For adding debug toolbar.
```
pip install django-debug-toolbar
```

## How to Set Up the Environment and the Project

1. Clone the GitHub Repository

Clone the repository to your local machine using Git:

```
git clone https://github.com/Beritha-n12/womxchange_e_commerce.git
cd womxchange_e_commerce
```

2. Set Up the Backend (Django)

2.1 Install Backend Dependencies
Navigating to the backend directory and create a virtual environment:

```
cd womxchange-backend
python -m venv venv
```

Activate the virtual environment:

# On Windows
```venv\Scripts\activate```

## Install the required backend dependencies:


```pip install -r requirements.txt```

2.2 Database Setup
Installing and creating database for the project:

Create a database for the project:

```CREATE DATABASE womxchange;```

Configure the database URL in womxchange/settings.py:
```
import dj_database_url
DATABASES['default'] = dj_database_url.config(default='postgres://USER:PASSWORD@localhost:5432/womxchange') 
```

2.3 Migrate the Database
Run migrations to set up the database schema:

```python manage.py migrate```

2.4 Create a Superuser
Create a superuser to access the Django admin:

```
python manage.py createsuperuser
```

2.5 Run the Development Server

Start the backend development server:
```
python manage.py runserver
```

3. Set Up the Frontend (React)

3.1 Install Frontend Dependencies

Navigate to the frontend directory and install dependencies:

```
cd womxchange-frontend
npm install
```
3.2 Run the Development Server

Start the React development server:

```npm run dev```

The frontend will be accessible at http://localhost:3000.

# Designs (Figma Mockups, Circuit Diagram, App Interfaces)
Figma Mockups: View Figma Design
Include the Figma link to view your app designs (e.g., wireframes, UI components).

Screenshots of App Interfaces:

Home Page:

Product Listing Page:

Cart Page:

Seller Dashboard:

Chatbot:

# Circuit Diagram:

The WomXchange Rwanda platform consists of various components that work together to form a robust and interactive e-commerce platform. Below is the description of the system architecture and how different pages, APIs, and services interact within the system. This overview includes frontend and backend components, as well as how they interact with each other.

1. System Overview (High-Level Architecture)
The system architecture can be broken down into two main layers: Frontend and Backend.

Frontend Layer (React)
The frontend is responsible for the user interface (UI) of the platform, which includes all the interactions that users (both buyers and sellers) have with the application. The React frontend communicates with the Django backend through API calls.

Pages:

Homepage: Displays featured products, product categories, promotions, etc.

Product Listing Page: Displays products with filter and sorting options.

Product Detail Page: Displays detailed information about a product.

Seller Dashboard: Sellers can manage their products and track orders.

Buyer Dashboard: Buyers can manage their orders, profile, and wishlist.

Cart Page: Displays products in the cart and allows users to proceed to checkout.

Checkout Page: Collects shipping and payment information from the user.

Order Confirmation Page: Displays a summary of the order and order number.

Login/Registration Pages: Allows both buyers and sellers to sign up or log in.

Backend Layer (Django + PostgreSQL)
The backend is responsible for handling business logic, managing data, and providing services through APIs. The Django REST Framework is used to build the APIs that interact with the React frontend. The PostgreSQL database is used for data storage.

APIs:

User Authentication API: Allows users to register, log in, and manage profiles (using Django Rest Auth).

Product Management API: Allows sellers to add, update, and delete products.

Order Management API: Handles order creation, status updates, and tracking.

Payment API: Integrates with MoMoPay for processing payments.

Chatbot API: Handles user queries and interactions with the chatbot.

Admin API: Allows admins to manage users, products, and monitor platform usage.

2. System Interaction Flow
Frontend to Backend Interaction
Homepage:

Users (buyers) visit the Homepage where featured products, categories, and promotions are displayed.

The React frontend makes API calls to the Product Management API to fetch product data from the PostgreSQL database.

This page interacts with the Product API to retrieve products that are displayed in various categories.

Product Listing Page:

The Product Listing Page displays products that can be filtered by category, price range, and other attributes.

The React frontend sends GET requests to the Product Management API, which filters the products in the database based on the user’s search parameters.

Product Detail Page:

When a buyer clicks on a product, they are redirected to the Product Detail Page.

The React frontend sends a GET request to fetch detailed information about the selected product (using the Product Management API).

Seller Dashboard:

Sellers log into their dashboard to manage products, view order history, and update product details.

The React frontend sends POST/PUT/DELETE requests to manage products through the Product Management API.

Buyer Dashboard:

Buyers can view their orders, track the status of their orders, and manage personal details.

The React frontend sends GET requests to the Order Management API to fetch order data from the database.

Chatbot Interaction:

The React frontend integrates a floating chatbot in the bottom-right corner of the page.

When a user sends a query, the React frontend sends a POST request to the Chatbot API in the backend.

The Chatbot API processes the query, generates a response, and returns it to be displayed in the chat window on the frontend.

Cart Page:

Buyers add items to their cart, which is handled by the Cart API.

The React frontend makes POST requests to add items to the cart and GET requests to fetch cart data.

Checkout Page:

After reviewing their cart, buyers proceed to the Checkout Page, where they enter shipping information and select a payment method.

The React frontend sends a POST request with the buyer's order details to the Order API.

The Payment API (MoMoPay) is called to handle the payment transaction.

Order Confirmation Page:

After successful payment, buyers are redirected to the Order Confirmation Page where they see the order summary.

This page is populated with data from the Order API, showing order details like the product list, total cost, shipping info, and order number.

3. Circuit Diagram
A circuit diagram for this system represents the data flow between the Frontend, Backend, and Database.

# Frontend (React App) → Backend (Django APIs):

User Authentication: The frontend sends registration/login data to the User Authentication API in the backend. The backend verifies the data and sends a response (success/error) back to the frontend.

Product Management: The frontend sends product queries to the Product Management API, and the backend fetches product data from the database.

Order Management: The frontend allows users to place, track, or cancel orders. The frontend sends order-related requests to the Order API.

Payment Processing: When an order is confirmed, the frontend sends payment data to the Payment API, which handles the payment transaction through MoMoPay.

# Backend (Django + PostgreSQL Database):

The Django Backend interacts with the PostgreSQL database to store user data, product listings, orders, and payment transactions.

The Django REST Framework exposes APIs that interact with the database and process data sent by the frontend.

# Database (PostgreSQL):

The PostgreSQL database stores all data related to products, users (buyers and sellers), orders, payments, and chatbot interactions.

It uses SQL queries to retrieve, insert, update, and delete data based on the requests made by the frontend through the backend APIs.

4. Design Flow (Pages and Interactions)
Homepage → Product Listing Page → Product Detail Page → Add to Cart → Checkout Page → Order Confirmation Page

Seller Dashboard → Product Management → Order Tracking

Buyer Dashboard → Order Tracking → Wishlist Management

Chatbot → Backend API → Chatbot Response

## System Flow (API Interaction)
User makes a request (Frontend → Backend):
The user interacts with the UI (searches for products, adds to the cart, etc.), and the frontend sends the necessary data (via Axios or other HTTP requests) to the backend.

Backend processes the request (Backend → Database):
The backend processes the request (e.g., fetches products, processes orders) and interacts with the PostgreSQL database.

Response is sent back to the frontend:
Once the backend finishes processing, it sends the response back to the frontend to display the relevant data (product list, order status, chatbot response, etc.).


# Deployment Plan

Deploy Backend on Heroku:

Set up Heroku for Django using the Heroku deployment guide for Django.

Use Heroku PostgreSQL to store your database in the cloud.

Push your backend code to Heroku:

```
git remote add heroku https://git.heroku.com/womxchange-backend.git
git push heroku master
```

# Deploy Frontend on Heroku:

Build the frontend for production:

```npm run build```


# Deploy the React app on Heroku (using serve to serve static files):

Create a Procfile in the frontend project:

```web: serve -s build```

# Push to Heroku:
```
git remote add heroku https://git.heroku.com/womxchange-frontend.git
git push heroku master
```

# Configuring CORS for Heroku:
CORS is configured in your Django app to allow the frontend to make requests:
```
CORS_ALLOWED_ORIGINS = [
    "https://womxchange-frontend.herokuapp.com",
]
```
# GitHub Repository
You can view and contribute to the project by visiting the GitHub repository:

https://github.com/Beritha-n12/womxchange_e_commerce