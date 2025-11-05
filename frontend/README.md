# Fake News Detector Frontend

React-based frontend for the Fake News Detector application.

## Features

- Modern, responsive UI
- Light/Dark mode toggle
- Real-time form validation
- Loading states and error handling
- Detailed result display with visualizations
- Mobile-friendly design
- Clean, accessible interface

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── components/
│   ├── Header.js          # App header with theme toggle
│   ├── NewsForm.js        # Input form for article details
│   ├── ResultDisplay.js   # Display prediction results
│   ├── About.js           # About section
│   └── Footer.js          # App footer
├── App.js                 # Main application component
├── index.js               # React entry point
└── *.css                  # Component styles
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Docker

```bash
# Build image
docker build -t fake-news-frontend .

# Run container
docker run -p 3000:80 fake-news-frontend
```

## Customization

### Theming

Edit CSS variables in `src/index.css`:

```css
:root {
  --accent-color: #2563eb;
  --success-color: #10b981;
  --danger-color: #ef4444;
  /* ... more variables */
}
```

### Components

All components are in `src/components/` with their own CSS files for easy customization.
