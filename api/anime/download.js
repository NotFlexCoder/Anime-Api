const express = require('express');
const router = express.Router();
const { watchAnime } = require('../../gogoanime'); // Assuming your main file is named gogoanime.js

// GET /anime/download?episode_id=naruto-episode-1
router.get('/download', async (req, res) => {
    const { episode_id } = req.query;

    if (!episode_id) {
        return res.status(400).json({ error: 'episode_id is required' });
    }

    try {
        const downloadLinks = await watchAnime(episode_id);
        return res.status(200).json({ episode_id, download_links: downloadLinks });
    } catch (error) {
        console.error('Error getting download link:', error.message);
        return res.status(500).json({ error: 'Failed to fetch download link.' });
    }
});

module.exports = router;
