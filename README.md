
# Sp-app

A full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to create accounts, share posts, and interact within a responsive web environment.

## 🚀 Features

  * **User Authentication**: Secure signup and login using JWT and bcrypt.
  * **Post Management**: Create, view, and delete social media posts.
  * **Media Support**: Image uploading and processing powered by Cloudinary, Multer, and Sharp.
  * **Security**: Enhanced header security with Helmet and CORS configuration.
  * **Responsive Frontend**: Modern UI built with React and Vite.

## 🛠️ Tech Stack

### Backend

  * **Runtime**: Node.js (\>= 18.0.0)
  * **Framework**: Express.js
  * **Database**: MongoDB with Mongoose ODM
  * **Authentication**: JSON Web Tokens (JWT)
  * **File Handling**: Multer & Cloudinary

### Frontend

  * **Framework**: React
  * **Build Tool**: Vite
  * **HTTP Client**: Axios

## 📋 Prerequisites

  * Node.js (Version 18 or higher)
  * MongoDB account/instance
  * Cloudinary account for image storage

## ⚙️ Installation & Setup

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/onfr0y/Sp-app.git
    cd Sp-app
    ```

2.  **Install dependencies**:
    Install both backend and frontend dependencies using the root build script:

    ```bash
    npm run build
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and add your credentials (MongoDB URI, Cloudinary API keys, JWT Secret).

## 🚀 Running the Application

### Development Mode

To run the backend with automatic restarts:

```bash
npm run dev
```

### Production Mode

To start the server normally:

```bash
npm start
```

## 🌐 Deployment

This project is configured for easy deployment on platforms like Heroku. It includes a `heroku-postbuild` script that automatically installs dependencies and builds the React frontend for production.

## 📄 License

This project is licensed under the **ISC License**.

-----

**Author**: [onfr0y](https://www.google.com/search?q=https://github.com/onfr0y)
