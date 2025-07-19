#!/bin/bash

echo "🚀 Quick Start Guide - XAMPP Setup"
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

print_step() {
    echo -e "${BLUE}📋 Step $1: $2${NC}"
}

# Step 1: Check Prerequisites
print_step "1" "Checking Prerequisites"

# Check if Node.js is installed
if command -v node &> /dev/null; then
    node_version=$(node --version)
    print_status 0 "Node.js installed: $node_version"
else
    print_status 1 "Node.js not found"
    echo "   Download from: https://nodejs.org/"
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    print_status 0 "npm installed: $npm_version"
else
    print_status 1 "npm not found"
fi

echo ""

# Step 2: Environment Setup
print_step "2" "Environment Configuration"

if [ -f ".env" ]; then
    print_status 0 ".env file exists"
else
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status 0 ".env created from template"
    else
        print_status 1 ".env.example not found"
    fi
fi

# Update .env for XAMPP
if [ -f ".env" ]; then
    print_info "Configuring .env for XAMPP setup..."
    
    # Backup original .env
    cp .env .env.backup
    
    # Update API URL for XAMPP
    sed -i.tmp 's|REACT_APP_API_BASE_URL=.*|REACT_APP_API_BASE_URL=http://localhost/penjadwalan-app/backend/api|' .env
    sed -i.tmp 's|REACT_APP_BACKEND_URL=.*|REACT_APP_BACKEND_URL=http://localhost/penjadwalan-app/backend|' .env
    
    # Clean up temp files
    rm -f .env.tmp
    
    print_status 0 "Environment configured for XAMPP"
fi

echo ""

# Step 3: Frontend Dependencies
print_step "3" "Installing Frontend Dependencies"

if [ -f "package.json" ]; then
    print_info "Installing npm dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_status 0 "Dependencies installed successfully"
    else
        print_status 1 "Failed to install dependencies"
        echo "   Try: npm install --legacy-peer-deps"
    fi
else
    print_status 1 "package.json not found"
fi

echo ""

# Step 4: XAMPP Instructions
print_step "4" "XAMPP Setup Instructions"

echo ""
print_info "Manual steps required:"
echo ""
echo "1. 📥 Download and Install XAMPP:"
echo "   - Visit: https://www.apachefriends.org/"
echo "   - Download XAMPP 8.1+ for your OS"
echo "   - Install to default location"
echo ""
echo "2. 🚀 Start XAMPP Services:"
echo "   - Open XAMPP Control Panel"
echo "   - Start Apache service"
echo "   - Start MySQL service"
echo "   - Ensure both show 'Running' status"
echo ""
echo "3. 📁 Copy Project to htdocs:"
echo "   - Copy this entire project folder to:"
echo "     Windows: C:\\xampp\\htdocs\\penjadwalan-app"
echo "     Linux: /opt/lampp/htdocs/penjadwalan-app"
echo "     macOS: /Applications/XAMPP/xamppfiles/htdocs/penjadwalan-app"
echo ""
echo "4. 🗄️ Setup Database:"
echo "   - Open phpMyAdmin: http://localhost/phpmyadmin"
echo "   - Create new database: 'penjadwalan_db'"
echo "   - Import file: backend/database.sql"
echo ""

# Step 5: Verification
print_step "5" "Verification URLs"

echo ""
print_info "After completing XAMPP setup, test these URLs:"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000 (after npm start)"
echo "   Backend: http://localhost/penjadwalan-app/backend"
echo "   API Health: http://localhost/penjadwalan-app/backend/api/health.php"
echo "   phpMyAdmin: http://localhost/phpmyadmin"
echo ""

# Step 6: Start Frontend
print_step "6" "Starting Frontend Development Server"

echo ""
print_info "Ready to start React development server?"
echo "This will open the application in your browser."
echo ""

read -p "Start React app now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting React development server..."
    echo ""
    echo "🚀 Starting npm start..."
    echo "   Frontend will be available at: http://localhost:3000"
    echo "   Make sure XAMPP services are running!"
    echo ""
    npm start
else
    print_info "Skipping React start. Run 'npm start' when ready."
fi

echo ""

# Final Instructions
print_header "Final Checklist"

echo ""
echo "📋 Pre-Presentation Checklist:"
echo "   [ ] XAMPP Apache service running"
echo "   [ ] XAMPP MySQL service running"
echo "   [ ] Database 'penjadwalan_db' created"
echo "   [ ] Database data imported from backend/database.sql"
echo "   [ ] Project copied to htdocs/penjadwalan-app"
echo "   [ ] React app running (npm start)"
echo "   [ ] Frontend accessible at http://localhost:3000"
echo "   [ ] Backend API responding at http://localhost/penjadwalan-app/backend"
echo ""

print_header "Troubleshooting"

echo ""
echo "🔧 Common Issues:"
echo ""
echo "❌ Apache won't start:"
echo "   - Check if port 80 is used by another service"
echo "   - Stop IIS or other web servers"
echo "   - Run XAMPP as Administrator"
echo ""
echo "❌ MySQL won't start:"
echo "   - Check if port 3306 is used"
echo "   - Stop other MySQL services"
echo "   - Restart XAMPP"
echo ""
echo "❌ Database connection failed:"
echo "   - Verify database name: penjadwalan_db"
echo "   - Check MySQL service is running"
echo "   - Ensure data is imported"
echo ""
echo "❌ Frontend can't reach backend:"
echo "   - Check .env configuration"
echo "   - Verify project is in htdocs/penjadwalan-app"
echo "   - Test API URL in browser"
echo ""

print_header "Success!"

echo ""
echo -e "${GREEN}🎉 XAMPP setup guide completed!${NC}"
echo ""
echo "📚 Additional Documentation:"
echo "   - SETUP_XAMPP.md - Detailed setup guide"
echo "   - DOKUMENTASI_UAS.md - Complete project documentation"
echo "   - PRESENTASI_UAS.md - Presentation guide"
echo ""
echo -e "${BLUE}Ready for UAS presentation! 🚀${NC}"
