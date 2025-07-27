# 📝 DreamMachine 1999 - Personal Journal App

A beautiful, modern journal application built with React and Express. Create personal journal entries with text and images, browse your memories, and keep track of your thoughts in a nostalgic retro-themed interface.

## ✨ Features

- ✍️ **Create journal entries** with rich text and multiple images
- 📷 **Multi-image support** - upload multiple photos per entry
- 🔍 **Browse memories** - view your past entries
- 🎨 **Beautiful retro UI** with a nostalgic aesthetic
- 💾 **Local storage** - all data stored locally using JSON database
- 📱 **Responsive design** - works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: LowDB (JSON file-based)
- **File Uploads**: Multer
- **Styling**: TailwindCSS with custom retro theme

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Go back to root directory
cd ..
```

### 2. Environment Configuration

The app is pre-configured to run on:
- **Backend**: Port 3010
- **Frontend**: Port 3008
- **Environment**: `.env` file is already set up

## 🎯 Running the Application

### Start the App
```bash
npm start
```

This command will:
- Start the Express backend on http://localhost:3010
- Start the React frontend on http://localhost:3008
- Automatically open your browser to http://localhost:3008

### Stop the App

#### Method 1: Kill All Processes (Recommended)
```bash
pkill -f "npm.*start" && pkill -f "react-scripts" && pkill -f "nodemon"
```

#### Method 2: If you have the terminal window open
Press `Ctrl + C` in the terminal where `npm start` is running

### Restart the App
```bash
# Stop first, then start
pkill -f "npm.*start" && pkill -f "react-scripts" && pkill -f "nodemon"
npm start
```

## 🔧 Port Configuration

- **Frontend**: http://localhost:3008
- **Backend API**: http://localhost:3010/api
- **File Uploads**: Stored in `/uploads` directory

If you need to change ports, update:
1. `.env` file - Change `PORT` for backend
2. `client/package.json` - Change `PORT=3008` in start script
3. `client/package.json` - Update `proxy` URL

## 📁 Project Structure

```
journal-app-main/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                # Express backend
│   ├── index.js          # Main server file
│   └── package.json
├── uploads/              # Image upload directory
├── db.json              # JSON database file
├── .env                 # Environment variables
└── package.json         # Root package.json
```

## 🔍 Checking App Status

### Check if servers are running:
```bash
# Check frontend (should show port 3008)
lsof -i :3008

# Check backend (should show port 3010)  
lsof -i :3010
```

### Test backend API:
```bash
curl http://localhost:3010/api/entries
```

## 🐛 Troubleshooting

### "Something is already running on port..."
- This means the app is already running! Just open http://localhost:3008
- To stop it: `pkill -f "npm.*start" && pkill -f "react-scripts" && pkill -f "nodemon"`

### "Failed to load entries"
- Check if backend is running: `lsof -i :3010`
- Check if API responds: `curl http://localhost:3010/api/entries`
- Restart the app: Stop all processes and run `npm start` again

### "Proxy error: Could not proxy request"
- This means frontend can't reach backend
- Ensure backend is running on port 3010
- Check `.env` file has `PORT=3010`

### Upload errors
- Ensure `uploads/` directory exists in project root
- Check file permissions

## 📸 Features in Detail

### Creating Entries
1. Click the "+" button
2. Add a title and content
3. Upload multiple images if desired
4. Save your entry

### Browsing Memories
- Navigate to the "Memories" tab
- View all your past entries
- Click on any entry to view details

### Image Support
- Multiple images per entry
- Automatic image optimization
- Local file storage

## 🎨 Customization

The app uses a retro aesthetic with:
- Dark theme with neon accents
- Custom fonts and spacing
- Nostalgic color palette

To customize the theme, edit the TailwindCSS configuration in `client/tailwind.config.js`.

## 📄 License

This project is for personal use. Built for learning and journaling purposes.

---

**Enjoy journaling!** 📝✨