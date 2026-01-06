# 🛠 Project Structure
## client
React frontend built with Vite, TypeScript, and Tailwind CSS. Contains the UI logic, state management, and map integrations.

## server
Node.js/Express backend with MongoDB/Mongoose. Handles user authentication, database schemas, and API routing.

## 🚀 Current Progress
- Architecture: Initial Project Architecture (Root, Client, Server) established.
- Database: Stable Backend Connection to MongoDB with user data persistence.
- Version Control: Git & .gitignore configuration (clean of node_modules and environment variables).
- Frontend Core: Initialized with Vite + TypeScript and Tailwind CSS for high-performance styling.

## UI Features:
- Smart Header: Scroll-reactive navigation that shrinks to optimize screen space.
- Interactive Sliders: Responsive property carousels built with Swiper.js.
- Free Mapping: Integrated Leaflet (OpenStreetMap) for a 100% free split-view search experience with custom "Price Tag" markers.

## 🛠 Installation & Setup
1. Clone the repository
Bash

git clone https://github.com/Ashokrawal/Airbnb_Clone_App.git
cd Airbnb_Clone_App
2. Backend Setup
Bash

cd server
npm install
## Create a .env file and add your MONGO_URL
npm start
3. Frontend Setup
Bash

cd ../client
## Use legacy-peer-deps to resolve React 18/Leaflet version conflicts
npm install --legacy-peer-deps
npm run dev
