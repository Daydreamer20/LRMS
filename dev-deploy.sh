@echo off

echo Creating required directories...
mkdir logs 2>nul

echo Starting deployment...

echo Stopping existing containers...
docker-compose down

echo Removing old images...
docker image prune -f

echo Building new images...
docker-compose build --no-cache

echo Starting services...
docker-compose up -d

echo Waiting for services to be ready...
timeout /t 10 /nobreak

echo Checking service health...
docker-compose ps

echo Checking application logs...
docker-compose logs app --tail 50

echo Deployment completed successfully!
echo You can now access the application at:
echo   - API:      http://localhost:8080
echo   - MongoDB:  mongodb://localhost:27017
echo.
echo To view logs:
echo   - Application: docker-compose logs app -f
echo   - MongoDB:    docker-compose logs mongodb -f 