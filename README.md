

# E-commerceApp-BE

This is a back-end application for an e-commerce website developed using Express.js and MongoDB. It provides RESTful API endpoints for various features such as:

- User authentication using JSON Web Tokens (JWT)
- Brand management (create, read, update, delete brands)
- Cart functionality (add, remove, update items in the cart)
- Category management (create, read, update, delete categories)
- Coupon handling (create, apply, delete coupons)
- Order management (create, read, update, delete orders)
- Product management (create, read, update, delete products)
- Subcategory management (create, read, update, delete subcategories)

The application also integrates with Stripe for payment processing and uses Nodemailer for sending emails and PDFKit for generating invoices.

## Prerequisites

To run this project, you need to have the following installed on your system:

- Node.js
- MongoDB
- npm

You also need to have an account on MongoDB Atlas and Stripe, and configure the following environment variables in a .env file:

PORT = "3000"
SALT_ROUNDS = 8 
CONNECTION_DB_URL = "mongodb://127.0.0.1:27017/e-commerceApp"
SIGN_IN_TOKEN_SECRET = "login"
CONFIRMATION_EMAIL_TOKEN = "confirmToken"
PROJECT_FOLDER="E-commerce Structure"
EMAIL_PASSWORD=""
EMAIL="" 
DEFAULT_TOKEN_SIGNATURE='hegazy'
BEARER_TOKEN_KEY='hegazy__'
RESET_PASSWORD_SIGNATURE =''
PROJECT_FOLDER="E-commerce Structure"
STRIPE_SECRET_KEY = ""
ORDER_TOKEN='orderToken'

## Installation

- Clone the repository: `git clone https://github.com/MohamedHegazy2020/e-commerce-freshcart.git`
- Install the dependencies: `npm install`
- Start the server: `npm start`
- The server will run on http://localhost:3000 by default

## API Documentation

You can find the API documentation [here](https://web.postman.co/workspace/896a776a-c58d-470d-8ebf-ceb0d1664ec4/documentation/25920197-bb62bdb2-8a5b-4ac9-99a1-eb2142d27b05)https://web.postman.co/workspace/896a776a-c58d-470d-8ebf-ceb0d1664ec4/documentation/25920197-bb62bdb2-8a5b-4ac9-99a1-eb2142d27b05). It describes the available endpoints, parameters, responses, and examples. You can also use Postman to test the API requests

