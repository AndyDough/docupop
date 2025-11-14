#!/bin/bash

# This script automates the process of recreating the PostgreSQL database.

# Stop the Docker container
echo "Stopping the Docker container..."
docker-compose down

# Remove the old volume
echo "Removing the old volume..."
docker volume rm docupop_postgres_data

# Start the Docker container
echo "Starting the Docker container..."
docker-compose up -d

# Wait for the database to be ready
echo "Waiting for the database to be ready..."
sleep 5

# Run the db:setup script
echo "Running the db:setup script..."
npm run db:setup

echo "Database recreated successfully."
