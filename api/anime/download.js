const axios = require("axios");
const cheerio = require("cheerio");
const chromium = require("chrome-aws-lambda");
const userAgent = require("user-agents");

const baseUrl = "https://gogoanime.run";

async function getDownloadLink(episode_link) {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setUserAgent(userAgent.random().toString());
  await page.goto(episode_link, { waitUntil: "networkidle0" });

  const links = await page.evaluate(() => {
    const ep_links = [];
    const ep = document.querySelector(".mirror_link");
    ep?.querySelectorAll("a")?.forEach((link) => {
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
  const episode_link = $("li.dowloads > a").attr("href");
  const ep = await getDownloadLink(episode_link);
  return ep;
}

module.exports = async (req, res) => {
  const { name } = req.query;

  if (!name) return res.status(400).json({ error: "Anime name required" });

  try {
    const episodeId = `${name}-episode-1`;
    const downloadLinks = await watchAnime(episodeId);
    res.status(200).json({ name, downloadLinks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch download links", details: err.message });
  }
};
