#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🌍 Virtual Tourist - Setup Script${NC}"
echo "=================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node -v)${NC}"

# Install root dependencies
echo -e "\n${BLUE}Installing root dependencies...${NC}"
npm install

# Setup client
echo -e "\n${BLUE}Setting up client...${NC}"
cd client
npm install

# Create client .env
if [ ! -f .env ]; then
    cat > .env << EOF
VITE_API_URL=/api
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
EOF
    echo -e "${GREEN}✓ Created client/.env${NC}"
fi

# Setup server
echo -e "\n${BLUE}Setting up server...${NC}"
cd ../server
npm install

# Create server .env
if [ ! -f .env ]; then
    cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/virtual-tourist
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
EOF
    echo -e "${GREEN}✓ Created server/.env${NC}"
fi

cd ..

echo -e "\n${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update server/.env with your credentials"
echo "2. Update client/.env with your API keys"
echo "3. Start MongoDB: mongod"
echo "4. Seed the database: cd server && npm run seed"
echo "5. Start development: npm run dev"
echo ""
echo "Or use Docker:"
echo "  docker-compose up --build"
