#!/bin/bash

echo "🧪 Test Integrasi Frontend-Backend"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_header() {
    echo -e "${BLUE}🔧 $1${NC}"
}

# Detect setup type
SETUP_TYPE=""
if curl -s http://localhost:8080/api/health.php > /dev/null 2>&1; then
    SETUP_TYPE="docker"
    API_BASE="http://localhost:8080/api"
    print_info "Detected Docker/Podman setup"
elif curl -s http://localhost/penjadwalan-app/backend/api/health.php > /dev/null 2>&1; then
    SETUP_TYPE="xampp"
    API_BASE="http://localhost/penjadwalan-app/backend/api"
    print_info "Detected XAMPP setup"
else
    echo -e "${RED}❌ Backend tidak dapat diakses!${NC}"
    echo "Pastikan salah satu setup berjalan:"
    echo "- XAMPP: http://localhost/penjadwalan-app/backend/api/health.php"
    echo "- Docker/Podman: http://localhost:8080/api/health.php"
    exit 1
fi

echo ""

# Test 1: Backend Health Check
print_header "Testing Backend Health"
health_response=$(curl -s ${API_BASE}/health.php)
if echo "$health_response" | grep -q '"success":true'; then
    print_status 0 "Backend health check passed"
    echo "   Database: $(echo "$health_response" | jq -r '.message' 2>/dev/null || echo 'Connected')"
else
    print_status 1 "Backend health check failed"
    echo "   Response: $health_response"
fi

echo ""

# Test 2: CRUD Operations
print_header "Testing CRUD Operations"

# CREATE
print_info "Testing CREATE operation..."
create_response=$(curl -s -X POST ${API_BASE}/jadwal.php \
    -H "Content-Type: application/json" \
    -d '{"kegiatan":"Test Integration","tanggal":"2025-08-01"}')

if echo "$create_response" | grep -q '"success":true'; then
    new_id=$(echo "$create_response" | jq -r '.id' 2>/dev/null)
    print_status 0 "CREATE operation successful (ID: $new_id)"
else
    print_status 1 "CREATE operation failed"
    echo "   Response: $create_response"
fi

# READ
print_info "Testing READ operation..."
read_response=$(curl -s ${API_BASE}/jadwal.php)
if echo "$read_response" | grep -q '"success":true'; then
    total=$(echo "$read_response" | jq -r '.total' 2>/dev/null || echo "unknown")
    print_status 0 "READ operation successful (Total records: $total)"
else
    print_status 1 "READ operation failed"
    echo "   Response: $read_response"
fi

# UPDATE (if create was successful)
if [ ! -z "$new_id" ] && [ "$new_id" != "null" ]; then
    print_info "Testing UPDATE operation..."
    update_response=$(curl -s -X PUT ${API_BASE}/jadwal.php \
        -H "Content-Type: application/json" \
        -d "{\"id\":$new_id,\"kegiatan\":\"Updated Test Integration\",\"tanggal\":\"2025-08-02\"}")
    
    if echo "$update_response" | grep -q '"success":true'; then
        print_status 0 "UPDATE operation successful"
    else
        print_status 1 "UPDATE operation failed"
        echo "   Response: $update_response"
    fi
    
    # DELETE
    print_info "Testing DELETE operation..."
    delete_response=$(curl -s -X DELETE ${API_BASE}/jadwal.php \
        -H "Content-Type: application/json" \
        -d "{\"id\":$new_id}")
    
    if echo "$delete_response" | grep -q '"success":true'; then
        print_status 0 "DELETE operation successful"
    else
        print_status 1 "DELETE operation failed"
        echo "   Response: $delete_response"
    fi
fi

echo ""

# Test 3: Frontend Dependencies
print_header "Testing Frontend Setup"

if [ -f "package.json" ]; then
    print_status 0 "package.json found"
    
    if [ -d "node_modules" ]; then
        print_status 0 "node_modules directory exists"
    else
        print_info "Installing frontend dependencies..."
        npm install > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            print_status 0 "Dependencies installed successfully"
        else
            print_status 1 "Failed to install dependencies"
        fi
    fi
else
    print_status 1 "package.json not found"
fi

# Test build
print_info "Testing frontend build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status 0 "Frontend build successful"
    if [ -d "build" ]; then
        build_size=$(du -sh build 2>/dev/null | cut -f1 || echo "unknown")
        echo "   Build size: $build_size"
    fi
else
    print_status 1 "Frontend build failed"
fi

echo ""

# Test 4: Environment Configuration
print_header "Testing Environment Configuration"

if [ -f ".env" ]; then
    print_status 0 ".env file exists"
    
    # Check API URL configuration
    if grep -q "REACT_APP_API_BASE_URL" .env; then
        api_url=$(grep "REACT_APP_API_BASE_URL" .env | cut -d'=' -f2)
        print_status 0 "API URL configured: $api_url"
        
        # Verify API URL matches detected setup
        if [ "$SETUP_TYPE" = "xampp" ] && echo "$api_url" | grep -q "penjadwalan-app"; then
            print_status 0 "API URL matches XAMPP setup"
        elif [ "$SETUP_TYPE" = "docker" ] && echo "$api_url" | grep -q "8080"; then
            print_status 0 "API URL matches Docker setup"
        else
            print_status 1 "API URL might not match current setup"
            echo "   Current setup: $SETUP_TYPE"
            echo "   Configured URL: $api_url"
            echo "   Expected URL: $API_BASE"
        fi
    else
        print_status 1 "REACT_APP_API_BASE_URL not configured"
    fi
else
    print_status 1 ".env file missing"
    echo "   Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status 0 ".env created from template"
    else
        print_status 1 ".env.example template not found"
    fi
fi

echo ""

# Summary
print_header "Test Summary"

echo -e "${GREEN}✅ Integration test completed!${NC}"
echo ""
echo "🌐 Access URLs:"
if [ "$SETUP_TYPE" = "xampp" ]; then
    echo "   Frontend: http://localhost:3000 (npm start)"
    echo "   Backend API: http://localhost/penjadwalan-app/backend"
    echo "   phpMyAdmin: http://localhost/phpmyadmin"
elif [ "$SETUP_TYPE" = "docker" ]; then
    echo "   Frontend: http://localhost:3000 (npm start)"
    echo "   Backend API: http://localhost:8080"
    echo "   phpMyAdmin: http://localhost:8081"
fi

echo ""
echo "🚀 Next Steps:"
echo "   1. Start React frontend: npm start"
echo "   2. Open browser: http://localhost:3000"
echo "   3. Test CRUD operations in the UI"
echo "   4. Verify data persistence in database"

echo ""
echo -e "${BLUE}🎉 Ready for presentation!${NC}"
