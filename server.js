const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4000;

app.get('/api/large-data', (req, res) => {
  const dataPath = path.join(__dirname, 'large-data.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read data' });
    } else {
      let movies = [];
      try {
        movies = JSON.parse(data);
      } catch (e) {
        return res.status(500).json({ error: 'Invalid JSON format' });
      }
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const paginated = movies.slice(offset, offset + limit);
      res.setHeader('Content-Type', 'application/json');
      res.json({
        data: paginated,
        total: movies.length,
        offset,
        limit,
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`BFF server running at http://localhost:${PORT}`);
});
