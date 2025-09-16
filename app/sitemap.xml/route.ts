// app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { routes } from "./routes";

const baseUrl = process.env.SITE_URL;

// ✅ Array containing all URLs
function generateSiteMap(pages: { loc: string; priority: string }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-style.xsl"?>  
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
      .map(
        (page) => `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join("")}
</urlset>`;
}


function generateSiteWithOutStyleMap(pages: { loc: string; priority: string }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
      .map(
        (page) => `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join("")}
</urlset>`;
}
export async function GET() {
  const xml = generateSiteMap(routes);

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
