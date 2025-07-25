import puppeteer from "puppeteer";
import path from "path";
import { URL } from "url";

const targetUrl = "https://plato.stanford.edu/entries/analytic-synthetic/"; // Change this to the URL you want to clone

export async function clonePage(url: string) {
  // Launch Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(`Opening page: ${url}`);
  await page.goto(url, { waitUntil: "networkidle2" });

  // Get HTML content of the page
  const html = await page.content();
  const updatedHtml = await updateHtmlUrls(url, html);
  console.log("Fetched HTML content");

  // Extract all CSS and JS URLs
  const urls = await page.evaluate(() => {
    const assets: string[] = [];
    document.querySelectorAll('link[rel="stylesheet"], script[src]').forEach((tag) => {
      const url = tag.getAttribute("href") || tag.getAttribute("src");
      if (url) assets.push(url);
    });
    return assets;
  });

  // Fetch and download the CSS and JS assets
  const assets = [];
  for (const assetUrl of urls) {
    const assetContent = await downloadAsset(url, assetUrl);
    assets.push({
      url: assetUrl,
      content: assetContent
    });
  }

  await browser.close();
  console.log("Cloning complete!");

  // Return HTML and assets as JS objects
  return {
    html: updatedHtml,
    assets: assets
  };
}

async function updateHtmlUrls(baseUrl: string, html: string): Promise<string> {
  const urls = await extractAssetUrls(html);

  // Replace asset URLs with placeholders or local paths
  urls.forEach((assetUrl) => {
    const assetName = path.basename(assetUrl);
    const localPath = path.join('local_path', assetName); // Placeholder for local path
    const assetUrlPattern = new RegExp(assetUrl, "g");
    html = html.replace(assetUrlPattern, localPath);
  });

  return html;
}

async function extractAssetUrls(html: string): Promise<string[]> {
  const urls: string[] = [];
  const regex = /(?:href|src)=(["'])(.*?)\1/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[2]);
  }
  return urls;
}

async function downloadAsset(baseUrl: string, assetPath: string): Promise<string> {
  const assetUrl = new URL(assetPath, baseUrl).toString();

  try {
    const res = await fetch(assetUrl);
    if (!res.ok) throw new Error(`Failed to fetch: ${assetUrl}`);

    const content = await res.text();
    console.log(`Downloaded content from: ${assetUrl}`);
    return content;
  } catch (error) {
    console.error(`Error downloading ${assetUrl}:`, error);
    return '';
  }
}

clonePage(targetUrl).then((result) => {
  // console.log("HTML Content:", result.html);
  console.log("Assets:", result.assets);
}).catch((error) => {
  console.error("Error:", error);
});
