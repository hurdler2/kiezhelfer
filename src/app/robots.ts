import { MetadataRoute } from "next";

const BASE_URL = "https://kiezhelfer.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          "/dashboard",
          "/profile",
          "/messages",
          "/listings/new",
          "/listings/*/edit",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
