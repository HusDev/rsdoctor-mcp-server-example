const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4000;

// Constants
const API_CONSTANTS = {
  PAGINATION_LIMIT: 10,
  MAX_PAGINATION_LIMIT: 50,
};

// Cache the parsed JSON data to avoid repeated file reads and parsing
let moviesCache = null;
let cacheInitialized = false;

const initializeCache = () => {
  if (cacheInitialized) return;

  try {
    const dataPath = path.join(__dirname, 'large-data.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    moviesCache = JSON.parse(data);
    cacheInitialized = true;
    console.log(`Loaded ${moviesCache.length} movies into cache`);
  } catch (error) {
    console.error('Failed to initialize movie cache:', error.message);
    moviesCache = [];
    cacheInitialized = true;
  }
};

// Initialize cache on server start
initializeCache();

app.get('/api/large-data', (req, res) => {
  if (!moviesCache) {
    return res.status(500).json({ error: 'Movie data not available' });
  }

  // Input validation with reasonable limits
  const offset = Math.max(0, parseInt(req.query.offset) || 0);
  const limit = Math.min(
    API_CONSTANTS.MAX_PAGINATION_LIMIT,
    Math.max(1, parseInt(req.query.limit) || API_CONSTANTS.PAGINATION_LIMIT)
  );

  // Bounds checking
  if (offset >= moviesCache.length) {
    return res.json({
      data: [],
      total: moviesCache.length,
      offset,
      limit,
    });
  }

  const paginated = moviesCache.slice(offset, offset + limit);

  res.json({
    data: paginated,
    total: moviesCache.length,
    offset,
    limit,
    hasMore: offset + limit < moviesCache.length,
  });
});

app.listen(PORT, () => {
  console.log(`BFF server running at http://localhost:${PORT}`);
});
