const cheerio = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer');
const userAgent = require('user-agents');

const baseUrl = "https://gogoanime.run";

async function getDownloadLink(episode_link) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(userAgent.random().toString());
  await page.goto(episode_link, { waitUntil: 'networkidle0' });

  const links = await page.evaluate(() => {
    const ep_links = [];
    const ep = document.querySelector(".mirror_link");
    ep?.querySelectorAll('a')?.forEach((link) => {
      const label = link.innerText.split("D ")[1]?.replace(/[()]/g, "");
      ep_links.push({ name: label, link: link.href });
    });
    return ep_links;
  });

  await browser.close();
  return links;
}

async function watchAnime(episode_id) {
  const res = await axios.get(`${baseUrl}/${episode_id}`);
  const $ = cheerio.load(res.data);
  const episode_link = $('li.dowloads > a').attr('href');
  if (!episode_link) return null;
  return await getDownloadLink(episode_link);
}

module.exports = async function handler(req, res) {
  const { episode_id } = req.query;

  if (!episode_id) {
    return res.status(400).json({ error: "Missing episode_id in query" });
  }

  try {
    const downloadLinks = await watchAnime(episode_id);
    if (!downloadLinks || downloadLinks.length === 0) {
      return res.status(404).json({ error: "No download links found" });
    }

    res.status(200).json({ episode_id, downloadLinks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch download links" });
  }
};
