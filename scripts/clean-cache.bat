@echo off
REM Virtual Tourist - Cache & Build Cleaner (Windows)
REM Cleans all cache, build artifacts, and temporary files

echo.
echo 🧹 Virtual Tourist Cache Cleaner
echo ================================
echo.

REM Root directory
echo === Cleaning Root Directory ===
echo.
if exist "node_modules" (
    echo Cleaning: node_modules
    rmdir /s /q node_modules
    echo ✓ Removed: node_modules
)
if exist ".pnpm-store" (
    echo Cleaning: .pnpm-store
    rmdir /s /q .pnpm-store
    echo ✓ Removed: .pnpm-store
)
if exist ".cache" (
    echo Cleaning: .cache
    rmdir /s /q .cache
    echo ✓ Removed: .cache
)
if exist ".temp" (
    echo Cleaning: .temp
    rmdir /s /q .temp
    echo ✓ Removed: .temp
)
if exist ".tmp" (
    echo Cleaning: .tmp
    rmdir /s /q .tmp
    echo ✓ Removed: .tmp
)
if exist ".parcel-cache" (
    echo Cleaning: .parcel-cache
    rmdir /s /q .parcel-cache
    echo ✓ Removed: .parcel-cache
)
if exist "coverage" (
    echo Cleaning: coverage
    rmdir /s /q coverage
    echo ✓ Removed: coverage
)
if exist ".nyc_output" (
    echo Cleaning: .nyc_output
    rmdir /s /q .nyc_output
    echo ✓ Removed: .nyc_output
)
if exist ".jest" (
    echo Cleaning: .jest
    rmdir /s /q .jest
    echo ✓ Removed: .jest
)
if exist "test-results" (
    echo Cleaning: test-results
    rmdir /s /q test-results
    echo ✓ Removed: test-results
)
if exist "playwright-report" (
    echo Cleaning: playwright-report
    rmdir /s /q playwright-report
    echo ✓ Removed: playwright-report
)
if exist "logs" (
    echo Cleaning: logs
    rmdir /s /q logs
    echo ✓ Removed: logs
)

REM Client directory
echo.
echo === Cleaning Client Directory ===
echo.
if exist "client" (
    cd client
    if exist "node_modules" (
        echo Cleaning: node_modules
        rmdir /s /q node_modules
        echo ✓ Removed: node_modules
    )
    if exist "dist" (
        echo Cleaning: dist
        rmdir /s /q dist
        echo ✓ Removed: dist
    )
    if exist "build" (
        echo Cleaning: build
        rmdir /s /q build
        echo ✓ Removed: build
    )
    if exist ".vite" (
        echo Cleaning: .vite
        rmdir /s /q .vite
        echo ✓ Removed: .vite
    )
    if exist ".parcel-cache" (
        echo Cleaning: .parcel-cache
        rmdir /s /q .parcel-cache
        echo ✓ Removed: .parcel-cache
    )
    if exist "coverage" (
        echo Cleaning: coverage
        rmdir /s /q coverage
        echo ✓ Removed: coverage
    )
    cd ..
)

REM Server directory
echo.
echo === Cleaning Server Directory ===
echo.
if exist "server" (
    cd server
    if exist "node_modules" (
        echo Cleaning: node_modules
        rmdir /s /q node_modules
        echo ✓ Removed: node_modules
    )
    if exist "dist" (
        echo Cleaning: dist
        rmdir /s /q dist
        echo ✓ Removed: dist
    )
    if exist "build" (
        echo Cleaning: build
        rmdir /s /q build
        echo ✓ Removed: build
    )
    if exist "logs" (
        echo Cleaning: logs
        rmdir /s /q logs
        echo ✓ Removed: logs
    )
    if exist "uploads" (
        echo Cleaning: uploads
        rmdir /s /q uploads
        echo ✓ Removed: uploads
    )
    if exist "tmp" (
        echo Cleaning: tmp
        rmdir /s /q tmp
        echo ✓ Removed: tmp
    )
    if exist "temp" (
        echo Cleaning: temp
        rmdir /s /q temp
        echo ✓ Removed: temp
    )
    cd ..
)

REM Package manager cache
echo.
echo === Package Manager Cache ===
echo.
where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Cleaning PNPM cache...
    pnpm store prune
    echo ✓ PNPM cache cleaned
)

where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Cleaning NPM cache...
    npm cache clean --force
    echo ✓ NPM cache cleaned
)

echo.
echo ================================
echo ✅ Cache Cleaning Complete!
echo ================================
echo.
echo Cleaned:
echo   - node_modules directories
echo   - build outputs (dist, build, out)
echo   - cache directories
echo   - log files
echo   - test coverage reports
echo   - temporary files
echo   - package manager caches
echo.
echo Note: Run 'pnpm install' or 'npm install' to reinstall dependencies
echo.
pause
