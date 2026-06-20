# Chatty - Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## Features

- **Real-Time Messaging**: Instant message delivery using WebSockets.
- **Online Status**: Track and display which users are currently online.
- **Authentication**: Secure JWT-based authentication with HTTP-only cookies.
- **Image Sharing**: Send images in chats (powered by Cloudinary).
- **Theme Customization**: Choose from 32 different themes using DaisyUI.
- **Responsive Design**: Optimized for mobile, tablet, and desktop screens.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, DaisyUI, Zustand (State Management), Lucide React (Icons).
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io.
- **Cloud Services**: Cloudinary (Image Hosting).

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- A MongoDB Atlas account.
- A Cloudinary account.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies for the entire project:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Create a `.env` file in the `backend/` directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5001
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NODE_ENV=development
   ```

### Running the App

Start both the frontend and backend concurrently:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment

This project is configured for easy deployment on Render.

1. Connect your GitHub repository to Render.
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Add the environment variables in the Render dashboard.

## License

This project is licensed under the MIT License.
