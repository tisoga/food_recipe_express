# Food Recipe API

Welcome to the Food Recipe API! This API allows you to give variety of food

## Introduction

The Food Recipe API is a RESTful web service designed with Express JS, JWT for authentication and Postgres for Databases to provide developers with easy access to a vast collection of food.

## Endpoints

| Method | Endpoint                                                | Description                                                      |
|--------|---------------------------------------------------------|------------------------------------------------------------------|
| GET    | api/v1/food-data                                        | Get all food data records                                        |
| GET    | api/v1/food-data?search='product_name'                  | Seatch all food data records by product_name                     |
| GET    | api/v1/food-data?category='food_category'               | Get all food data records by food_category                       |
| POST   | api/v1/food-data                                        | Create new food data (requires token)                            |
| GET    | api/v1/food-data/:id                                    | Get specific food data by ID                                     |
| PATCH  | api/v1/food-data/:id                                    | Edit specific food data (requires token)                         |
| PUT    | api/v1/food-data/:id                                    | Edit or add specific food data (requires token)                  |
| GET    | api/v1/user                                             | Get user details (requires token)                                |
| POST   | api/v1/auth/login                                       | User login                                                       |
| POST   | api/v1/auth/register                                    | Register new user                                                |

## JWT Authentication

Headers {
    Authentication : Bearer ${JWT_TOKEN}
}

You can get JWT TOKEN in /login Endpoint

## DEMO

https://food-api.ryan-retired.my.id