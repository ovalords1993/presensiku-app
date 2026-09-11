import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Presensiku",
    short_name: "Presensiku",
    description: "Multi-tenant school attendance PWA",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#4f46e5",
    lang: "id",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
