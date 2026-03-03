@echo off
REM MongoDB Setup Script for Windows (Development)
REM This script helps you set up MongoDB for local development

setlocal enabledelayedexpansion

echo ========================================
echo   MongoDB Setup for Virtual Tourist
echo ========================================
echo.

REM Colors (Windows 10+)
set "GREEN=[32m"
set "BLUE=[34m"
set "YELLOW=[33m"
set "RED=[31m"
set "NC=[0m"

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo %GREEN%✓%NC% Docker is installed
) else (
    echo %YELLOW%✗%NC% Docker is not installed
    echo Please install Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %errorlevel% equ 0 (
    echo %GREEN%✓%NC% Docker Compose is installed
) else (
    docker compose version >nul 2>nul
    if %errorlevel% equ 0 (
        echo %GREEN%✓%NC% Docker Compose is installed
    ) else (
        echo %YELLOW%✗%NC% Docker Compose is not installed
    )
)

echo.
echo Select setup method:
echo   1^) Docker MongoDB ^(Recommended^)
echo   2^) Local MongoDB ^(Compass^)
echo   3^) MongoDB Atlas ^(Cloud^)
echo.
set /p setup_choice="Enter choice (1-3): "

if "%setup_choice%"=="1" (
    goto :setup_docker
) else if "%setup_choice%"=="2" (
    goto :setup_local
) else if "%setup_choice%"=="3" (
    goto :setup_atlas
) else (
    echo %RED%✗%NC% Invalid choice
    pause
    exit /b 1
)

:setup_docker
echo.
echo %BLUE%Setting up MongoDB with Docker...%NC%
echo.

REM Check if container already exists
docker ps -a --format "{{.Names}}" | findstr "virtual-tourist-mongodb" >nul 2>nul
if %errorlevel% equ 0 (
    echo %YELLOW%!%NC% MongoDB container already exists
    set /p recreate="Do you want to remove and recreate it? (y/n) "
    if /i "%recreate%"=="y" (
        docker rm -f virtual-tourist-mongodb
    ) else (
        echo Starting existing container...
        docker start virtual-tourist-mongodb
        goto :create_env
    )
)

REM Create and start MongoDB container
echo Creating MongoDB container...
docker run -d ^
    --name virtual-tourist-mongodb ^
    -p 27017:27017 ^
    -e MONGO_INITDB_ROOT_USERNAME=admin ^
    -e MONGO_INITDB_ROOT_PASSWORD=admin123 ^
    -e MONGO_INITDB_DATABASE=virtual-tourist ^
    -v virtual-tourist-mongodb-data:/data/db ^
    mongo:7

echo.
echo %GREEN%✓%NC% MongoDB container started!
echo.
goto :create_env

:setup_local
echo.
echo %BLUE%Checking local MongoDB...%NC%

REM Try to connect to local MongoDB
powershell -Command "try { $client = New-Object MongoDB.Driver.MongoClient('mongodb://localhost:27017'); $client.ListDatabaseNames() } catch { exit 1 }" >nul 2>nul
if %errorlevel% equ 0 (
    echo %GREEN%✓%NC% MongoDB is running locally
    goto :create_env
) else (
    echo %YELLOW%✗%NC% MongoDB is not running locally
    echo.
    echo Please install and start MongoDB first:
    echo   1. Install MongoDB: https://www.mongodb.com/try/download/community
    echo   2. Or use Docker: Select option 1
    echo.
    pause
    exit /b 1
)

:setup_atlas
echo.
echo To use MongoDB Atlas:
echo   1. Visit https://cloud.mongodb.com
echo   2. Create a free cluster
echo   3. Get connection string
echo   4. Add to server\.env: MONGODB_URI=your-connection-string
echo.
goto :create_env

:create_env
echo.
echo %BLUE%Creating .env files...%NC%

REM Create server .env
(
echo # ============================================
echo # DATABASE CONFIGURATION - 2026
echo # ============================================
echo.
echo # MongoDB Local ^(Docker^) - Primary for Development
echo MONGODB_URI_DOCKER=mongodb://admin:admin123@localhost:27017/virtual-tourist?authSource=admin
echo.
echo # MongoDB Local ^(Compass/Standalone^) - Fallback
echo MONGODB_URI_LOCAL=mongodb://localhost:27017/virtual-tourist
echo.
echo # MongoDB Atlas ^(Production^) - Add your Atlas URI here
echo REM MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/virtual-tourist
echo.
echo # Force local database ^(set to 'true' to skip Atlas^)
echo USE_LOCAL_DB=true
echo.
echo # Database Name
echo MONGODB_DB_NAME=virtual-tourist
echo.
echo # ============================================
echo # SERVER CONFIGURATION
echo # ============================================
echo PORT=5000
echo NODE_ENV=development
echo CLIENT_URL=http://localhost:5173
echo.
echo # ============================================
echo # AUTHENTICATION
echo # ============================================
echo JWT_SECRET=virtual-tourist-dev-secret-key-2026-change-in-production
echo JWT_EXPIRE=30d
echo COOKIE_EXPIRE=30
echo.
echo # ============================================
echo # CORS
echo # ============================================
echo CORS_ORIGIN=http://localhost:5173
echo.
echo # ============================================
echo # RATE LIMITING ^(Development - Relaxed^)
echo # ============================================
echo RATE_LIMIT_WINDOW_MS=900000
echo RATE_LIMIT_MAX_REQUESTS=1000
echo.
echo # ============================================
echo # LOGGING
echo # ============================================
echo LOG_LEVEL=debug
) > server\.env

echo %GREEN%✓%NC% server\.env created

REM Create client .env
(
echo # ============================================
echo # API CONFIGURATION - 2026
echo # ============================================
echo VITE_API_URL=http://localhost:5000/api
echo.
echo # ============================================
echo # APP CONFIGURATION
echo # ============================================
echo VITE_APP_NAME=Virtual Tourist
echo VITE_APP_DESCRIPTION=Explore the world with 360° virtual tours
echo VITE_APP_URL=http://localhost:5173
echo.
echo # ============================================
echo # FEATURE FLAGS
echo # ============================================
echo VITE_ENABLE_PWA=true
echo VITE_ENABLE_ANALYTICS=false
echo VITE_ENABLE_NOTIFICATIONS=true
) > client\.env

echo %GREEN%✓%NC% client\.env created

:show_info
echo.
echo ========================================
echo   MongoDB Connection Information
echo ========================================
echo.
echo %GREEN%✓%NC% MongoDB is ready to use!
echo.
echo Connection Strings:
echo   Docker:  mongodb://admin:admin123@localhost:27017/virtual-tourist
echo   Local:   mongodb://localhost:27017/virtual-tourist
echo.
echo MongoDB Compass:
echo   Connection String: mongodb://admin:admin123@localhost:27017
echo.
echo Commands:
echo   Start:   docker start virtual-tourist-mongodb
echo   Stop:    docker stop virtual-tourist-mongodb
echo   Remove:  docker rm -f virtual-tourist-mongodb
echo.
echo Using Docker Compose:
echo   Start:   docker-compose up mongodb
echo   Stop:    docker-compose down
echo.
echo ========================================
echo.
echo %GREEN%✓%NC% Setup complete!
echo.
echo Next steps:
echo   1. cd server ^&^& npm run dev
echo   2. cd client ^&^& npm run dev
echo.

pause
