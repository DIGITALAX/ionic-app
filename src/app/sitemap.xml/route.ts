import { NextResponse } from "next/server";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://ionic.digitalax.xyz";

export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
   <url>
        <loc>${baseUrl}/</loc>
  </url>
     <url>
        <loc>${baseUrl}/nfts/</loc>
  </url>
     <url>
        <loc>${baseUrl}/market/</loc>
  </url>
     <url>
        <loc>${baseUrl}/about/</loc>
  </url>
</urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
