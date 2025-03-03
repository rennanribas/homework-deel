# DEEL BACKEND TASK

👨‍💻 Created by Rennan Ribas (new Deel Developer, I do hope so! 🤞:D)

💫 Welcome! 🎉
This backend exercise involves building a Node.js/Express.js app that will serve a REST API.

## Running the Backend

### Docker

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Run `docker build -t hometask-deel .`
3. Run `docker run -p 3000:3000 hometask-deel`

### Development with local Node

1. Install [Node](https://nodejs.org/en/download/)
2. Run `npm install`
3. Run `npm run seed`
4. Run `npm run dev`

## Testing

1. Install [Node](https://nodejs.org/en/download/)
2. Run `npm install`
3. Run `npm run test`

## Postman Collection

1. Install [Postman](https://www.postman.com/)
2. Run `postman run Deel Homework.postman_collection.json`, or open the `Deel Homework.postman_collection.json` file in Postman.

## FrontEnd

### React app with unpaid contracts, job payment, profile info and contract info

1. Download the repo on https://github.com/rennanribas/deel-homework-app
2. Run `npm install`
3. Run `npm start`

## On-line test

You can access the backend (this) app on:

### https://homework-deel.onrender.com/

You can Access the frontend (this) app on:

### https://deel-homework-app.onrender.com/

## Data Models (Entities)

### Profile

A profile can be either a `client` or a `contractor`.
clients create contracts with contractors. contractor does jobs for clients and get paid.
Each profile has a balance property.

### Contract

A contract between and client and a contractor.
Contracts have 3 statuses, `new`, `in_progress`, `terminated`. contracts are considered active only when in status `in_progress`
Contracts group jobs within them.

### Job

contractor get paid for jobs by clients under a certain contract.

## Technical Notes

- The server is running with [nodemon](https://nodemon.io/) which will automatically restart for you when you modify and save a file.

- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is on top of it. You should only have to interact with Sequelize - **please spend some time reading sequelize documentation before starting the exercise.**

- To authenticate users use the `getProfile` middleware that is located under src/middleware/getProfile.js. users are authenticated by passing `profile_id` in the request header. after a user is authenticated his profile will be available under `req.profile`. make sure only users that are on the contract can access their contracts.
- The server is running on port 3000.

## Endpoints Implemented

1. **_GET_** `/contracts/:id` - Returns the contract only if it belongs to the profile calling.

1. **_GET_** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

1. **_GET_** `/jobs/unpaid` - Get all unpaid jobs for a user (**_either_** a client or contractor), for **_active contracts only_**.

1. **_POST_** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

1. **_POST_** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

1. **_GET_** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

1. **_GET_** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
