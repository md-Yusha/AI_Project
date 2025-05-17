# AI Sketch Generator Frontend

A modern, professional frontend for the AI Sketch Generator application built with Vite and React.

## Features

- Modern UI with Tailwind CSS
- Professional animations with Framer Motion
- Responsive design for all devices
- Improved image display
- ChatGPT-like upload interface
- Real-time loading animations

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Navigate to the frontend-vite directory
3. Install dependencies:

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server, typically at http://localhost:5173.

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with the compiled assets.

## Backend Connection

The frontend is configured to connect to the Django backend at `http://localhost:8000`. Make sure the backend server is running before using the application.

## Technologies Used

- Vite - Fast build tool and development server
- React - UI library
- Tailwind CSS - Utility-first CSS framework
- Framer Motion - Animation library
- Axios - HTTP client
