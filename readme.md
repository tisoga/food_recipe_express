# Food Recipe API

Welcome to the Food Recipe API! This API allows you to give variety of food

## Introduction

The Food Recipe API is a RESTful web service designed with Express JS and JWT for authentication to provide developers with easy access to a vast collection of food.

## Endpoints

| Method | Endpoint            | Description                                  |
|--------|---------------------|----------------------------------------------|
| GET    | /food-data          | Get all food data records                   |
| POST   | /food-data          | Create new food data (requires token)       |
| GET    | /food-data/:id      | Get specific food data by ID                |
| PATCH  | /food-data/:id      | Edit specific food data (requires token)    |
| PUT    | /food-data/:id      | Edit or add specific food data (requires token) |
| GET    | /users              | List all users (requires token)             |
| GET    | /user               | Get user details (requires token)           |
| POST   | /login              | User login                                  |
| POST   | /register           | Register new user                           |

## DEMO

https://food-api.ryan-retired.my.id