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

## 🖼️ Media Management with Cloudinary
- We implemented a robust image handling system that combines MongoDB for metadata storage and Cloudinary for high-performance asset delivery.
- 
## How it Works
- Storage: Property images are hosted on Cloudinary. The MongoDB database stores the public_id and the secure url for each image.
- Backend API: The Node/Express backend serves these URLs through the /api/v1/user/folder/home/photos endpoint.
- Frontend Fetching: The React client fetches these URLs and applies Dynamic Transformations to optimize performance.

## Optimization
- Instead of loading massive raw files, we use Cloudinary's URL transformation parameters to ensure the app stays fast:
- Auto-Formatting: Delivers images in modern formats like WebP or AVIF based on the user's browser.
- Smart Compression: Automatically reduces file size without visible loss in quality.

## Resizing & Cropping:
- For Sliders, we use w_500,ar_1:1,c_fill to ensure all cards are perfectly square.
- For Search Listings, we use w_600 to balance quality and load speed.


## 🛠️ Updated Progress
- Image Optimization: Successfully integrated Cloudinary transformations to reduce page load times by up to 60%.
- Data Flow: Verified the end-to-end flow from MongoDB image records to React Swiper components.

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
