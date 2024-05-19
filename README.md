# GDSI-BillBuddies-backend

## Description

This is the backend for the GDSI BillBuddies project. It is a RESTful API that allows users to create, read, update, and delete groups and expenses. It also allows users to create, read, update, and delete users. The API is built using Node.js, Express, and PostgreSQL.

## Installation

### Local Installation
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Create a `.env` file from the `.env.example` file and fill in the necessary environment variables
4. Run `npm start` to start the server

### Docker Installation
1. Clone the repository
2. Run `docker-compose up --build` to build and start the server

### Categories seed data

1. Install sequelize-cli globally by running `npm install -g sequelize-cli`
2. Copy the `config/config.json.example` file to `config/config.json` and fill in the necessary database connection information
3. Start the app so it syncs the database and creates the tables
4. Run `sequelize db:seed:all` to seed the categories table
