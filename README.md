# Local Library App
This is an example app for a library. It stores: books, authors, genres and book copies. I designed the database schema and the objects have many relationships amongst them. The app supports all CRUD operations.

The database is hosted on Atlas (DaaS) and the backend code itself on Heroku.

I have used Pug as the templating engine to create views for this project and Mongoose as the ODM for the databse, for easier operations. Amongst other things I have also learned proper form handling with validation and sanitization of user inputs with express-validator, as well as about security and performance by utilizing additional middleware, like Helmet and compression.

## Demo
Live: https://zirafniks-library.herokuapp.com/catalog

## Tech stack
1. Node.js
2. Express
3. MongoDB
4. Mongoose
5. Pug