const express = require('express');
const cors = require('cors');
const mockData = require('./mockData');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/search', (req, res) => {
    const { q, page = '1', limit = '10' } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 10);

    let results = mockData;
    if (q && q.trim().length > 0) {
        const lowerQuery = q.trim().toLowerCase();
        results = mockData.filter((item) => {
            return (
                item.name.toLowerCase().includes(lowerQuery) ||
                item.role.toLowerCase().includes(lowerQuery) ||
                item.city.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery)
            );
        });
    }

    const total = results.length;
    const totalPages = Math.ceil(total / pageSize);
    const offset = (pageNum - 1) * pageSize;
    const paged = results.slice(offset, offset + pageSize);

    res.json({
        total,
        page: pageNum,
        limit: pageSize,
        totalPages,
        data: paged,
        query: q || null
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Search API is running. Use /search?q=keyword&page=1&limit=10' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
