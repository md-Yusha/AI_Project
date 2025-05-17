#!/bin/bash

# Start the Django backend
echo "Starting Django backend..."
cd
source env/django/bin/activate
cd /Users/Yusha/Documents/proj/backend
python manage.py runserver &
BACKEND_PID=$!

# Start the Vite frontend
echo "Starting Vite frontend..."
cd /Users/Yusha/Documents/proj/frontend-vite
npm i
npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

# Register the cleanup function for when the script is terminated
trap cleanup SIGINT SIGTERM

echo "Both servers are running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173 (or another port if 5173 is in use)"
echo "Press Ctrl+C to stop both servers."

# Keep the script running
wait