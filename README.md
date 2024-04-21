# FoodApp API Documentation

## Overview

The FoodApp API provides endpoints for managing food items and orders. This documentation outlines the available endpoints, their functionalities, and sample requests.
Mainly for backend.

## Getting Started

To start the server, use the command `npm start`. The base URL for the API is `http://localhost:3000`. 
Note that a MongoDB online cluster is used for data storage.


## Authentication

Authentication is required for certain endpoints. Ensure that you are authenticated by accessing http://localhost:3000 before using the API.

## pre-requisite
add a `.env`file with :
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_MAIL=
GOOGLE_PASSWORD=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
MONGODB_URI=
WEATHER_API_KEY= 
WEATHER-API-HOST=
``` 

## API Endpoints
Since its a backend dependent code,some front-end parts are not complete, so use postman to check the post and get calls.

### 1. Add Food

- **Endpoint:** POST http://localhost:3000/api/add-food
- **Sample Data:**
```json
{
    "id": "99",
    "name": "Biryani",
    "description": "Delicious Biryani.",
    "price": 100,
    "image": "Biryani.jpg",
    "category": "non-veg"
}
```

### 2. Get All Food

- **Endpoint:** GET http://localhost:3000/api/get-food
- **Sample Request:** http://localhost:3000/api/get-food

### 3. Add Order

- **Endpoint:** POST http://localhost:3000/api/add-order
- **Sample Data:**
```json
{
    "foodId": "1",
    "userId": "user123",
    "orderId": "order123",
    "status": "pending",
    "userAddressId": "address123",
    "paymentMode": "card"
}
```

### 4. Update Order

- **Endpoint:** PUT http://localhost:3000/api/update-order/{orderId}
- **Sample Request:** http://localhost:3000/api/update-order/order12
- **Sample Data:**
```json
{
    "status": "completed"
}
```

### 8. Mock Payment

**Sample Data for /api/add-order Endpoint:**

- **Method:** POST
- **URL:** http://localhost:3000/api/add-order
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
  "foodId": "sample_food_id",
  "userId": "sample_user_id",
  "userAddressId": "sample_address_id",
  "paymentMode": "credit_card"
}
```

**Sample Data for /api/mock-payment Endpoint:**

- **Method:** POST
- **URL:** http://localhost:3000/api/mock-payment
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
    "status": "completed"
}
```
### 9. Mobile OTP Verification 

**Sample Data for /api/send-motp Endpoint:**

- **Method:** POST
- **URL:** http://localhost:3000/api/send-motp
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
    "phoneNumber": "+919686630424"
}
```

**Sample Data for /api/verify-motp Endpoint:**

- **Method:** POST
- **URL:** http://localhost:3000/api/verify-motp
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
    "orderId":"66137ccb89cbe67e491e9bac",
    "phoneNumber": "+919686630424",
    "useOTP": "427035"
}
```


### 10. Get Foods by Weather

- **Method:** GET
- **URL:** http://localhost:3000/api//foods/:weather
- **Parameters:**
  - `sunny` (string): The weather condition for which food items are being requested.
- **Response:**
  - **Success (200 OK):** An array of food items that match the specified weather condition.
    ```json
    [
        {
            "id": "1",
            "name": "Kulfi",
            "description": "kulfi ice-cream",
            "category": "dessert"
        },
        {
            "id": "2",
            "name": "Mango Cheesecake",
            "description": "creamy chessecake",
            "category": "dessert"
        },
        
    ]
    ```
  

### 11. Get Food Name Suggestions

- **Method:** GET
- **URL:** http://localhost:3000/api//foods/suggest/:letters
- **Parameters:**
  - `g` (string): The starting letters for which food items are being suggested.
- **Response:**
  - **Success (200 OK):** An array of food items whose names start with the specified letters.
    ```json
    [
        {
            "id": "1",
            "name": "grilled Chicken",
            "description": "Juicy grilled chicken, perfect for any occasion.",
            "category": "grilled"
        },
        {
            "id": "2",
            "name": "green Salad",
            "description": "A refreshing salad with fresh greens and vegetables.",
            "category": "salad"
        },
        
    ]
    ```

### 12. Search for Foods

- **Method:** GET
- **URL:** http://localhost:3000/api//foods/search/:name
- **Parameters:**
  - `chicken` (string): The name or part of the name of the food item being searched.
- **Response:**
  - **Success (200 OK):** An array of food items whose names contain the specified search term.
    ```json
    [
        {
            "id": "1",
            "name": "Chicken Alfredo Pasta",
            "description": "Creamy pasta with tender chicken and Alfredo sauce.",
            "category": "pasta"
        },
       
    ]
    ```
