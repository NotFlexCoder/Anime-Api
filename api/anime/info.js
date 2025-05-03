import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(name)}&page=1`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();

  if (searchData.data && searchData.data.length > 0) {
    const anime = searchData.data[0];
    return res.status(200).json({
      title: anime.title,
      episodes: anime.episodes,
      genre: anime.genres.map(g => g.name).join(', '),
      synopsis: anime.synopsis,
      image_url: anime.images.jpg.image_url
    });
  }

  return res.status(404).json({ error: 'Anime not found' });
}
