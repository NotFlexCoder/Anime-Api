## 🎌 Anime Detail API

This simple API allows you to search for anime using the [Jikan API](https://docs.api.jikan.moe/). It returns basic information like title, episodes, genres, synopsis, and image of the first search result.

## 🚀 Features

- 🔎 Search anime by name.
- 📺 Get episodes, genres, synopsis, and poster image.
- ✅ Simple GET-based interface.
- 🌐 Powered by Jikan’s public API.

## 📦 Requirements

- Node.js 14+
- `node-fetch` module

## 📡 Usage

**1. Endpoint**

Send a GET request to the deployed function or local server:
`GET /api/anime?name=Naruto`

**2. Query Parameters**

| Parameter | Required | Description                            |
|-----------|----------|----------------------------------------|
| `name`    | ✅       | Name of the anime you want to search   |

**✅ Example Request**

```bash
curl "http://localhost:3000/api/anime?name=Naruto"
```

**✅ Example Response**

```json
{
  "title": "Naruto",
  "episodes": 220,
  "genre": "Action, Adventure, Comedy",
  "synopsis": "Moments prior to Naruto Uzumaki's birth, a huge demon known as the Kyuubi...",
  "image_url": "https://cdn.myanimelist.net/images/anime/13/17405.jpg"
}
```

**❌ Error Responses**

- Missing query:

```json
{
  "error": "Name is required"
}
```

- No results found:

```json
{
  "error": "Anime not found"
}
```

## 🔍 Code Explanation

- Uses `fetch` to call the Jikan API with the provided anime name.
- Extracts the first anime result from the API.
- Returns relevant anime data (title, episodes, genre list, synopsis, and image).
- Handles missing query or empty results gracefully.

## ⚠️ Error Handling

- 📭 400 Bad Request: If `name` is not provided.
- ❓ 404 Not Found: If no anime matches the query.
- 💥 500 Internal Server Error: If API call fails.

## 📄 License

This project is licensed under the License - see the [LICENSE](https://github.com/NotFlexCoder/anime-api/blob/main/LICENSE) file for details.
