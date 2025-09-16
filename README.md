## Project Overview

This project was created using [Nest](https://github.com/nestjs/nest). This API also includes authentication system using JWT (JSON Web Tokens). And an API documentation with [Swagger API](https://github.com/nestjs/swagger).

## Project Features
- User Registration and Login/Logout
  - Project users can create a secure account as their password encrypted using [bcrypt](https://github.com/kelektiv/node.bcrypt.js) 
- JWT Authentication
  - This project implements token-based authentication to store user_id, username and email to protect routes and make sure only authorized users can access some functionalities.
- Validation and Error handling
  - Input validation using [class-validator](https://github.com/typestack/class-validator)
- Environment Variables
  - Enviroment configurations stored using .env
- Data storage using MySQL
  - Data are stored using MySQL as database integration
- User authorization
  - Implemented user authorization on some inputs that the user details are provided.

## Project setup

```bash
$ npm install
```

## Packages Installed

- [@nestjs/swagger](https://github.com/nestjs/swagger)
  - For the API documentation
- [@nestjs/config](https://github.com/nestjs/config)
  - .env file library
- [class-validator](https://github.com/typestack/class-validator)
  - NestJS validation library
- [class-transformer](https://github.com/typestack/class-transformer)
  - NestJS validation library
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) 
  - For the password encryption and decryption
- [@nestjs/typeorm](https://github.com/nestjs/typeorm) typeorm mysql2
  - MySQL connection for NestJS
- [@nestjs/jwt](https://github.com/nestjs/jwt)
  - JWT utilities module for Nest based on the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) package.
- [@nestjs/passport](https://github.com/nestjs/passport)
  - Passport utilities for NestJS
- [passport](https://github.com/jaredhanson/passport)
  - Authentication middleware for Node.js
- [passport-jwt](https://github.com/mikenicholson/passport-jwt)
  - Strategy for authenticating JWT (JSON Web Tokens)
- [@types/passport-jwt](https://github.com/DefinitelyTyped/DefinitelyTyped)
  - Type definitions for passport-jwt

## How to use

1. Create the database provided on the .env (DB_NAME).
2. Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```
3. Seed the database using the link ```localhost:3000/seed```
4. Access the Swagger API by going on the link ```localhost:3000/swagger```
5. Login using the provided credentials using the ```/login``` endpoint
  - Or you can create an account first via ```/register``` endpoint and login again via the ```/login``` endpoint.
6. Copy the token value to be used as an authorization.
7. Use the authorize button or click the (<svg width=1em xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. --><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg> ) icon.
8. Once token provided, other functionalities are unlocked.

## Incomplete Functionalities
- Some inputs can still have authorization functionalities implemented
- Database joins not used in this project
- Connect the inputs (e.g. tasks should be connected to the project and be connected to the user logged in)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
