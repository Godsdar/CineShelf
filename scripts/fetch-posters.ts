import { mkdir, stat, writeFile } from "node:fs/promises";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
const dry = process.argv.includes("--dry");

// Curated mapping: our movie title -> exact Wikipedia article title.
const WIKI: Record<string, string> = {
  "The Shawshank Redemption": "The Shawshank Redemption",
  "The Godfather": "The Godfather",
  "The Dark Knight": "The Dark Knight",
  "Pulp Fiction": "Pulp Fiction",
  "Forrest Gump": "Forrest Gump",
  Inception: "Inception",
  "The Matrix": "The Matrix",
  Goodfellas: "Goodfellas",
  Se7en: "Seven (1995 film)",
  "The Silence of the Lambs": "The Silence of the Lambs (film)",
  Interstellar: "Interstellar (film)",
  "The Green Mile": "The Green Mile (film)",
  Gladiator: "Gladiator (2000 film)",
  "The Lion King": "The Lion King",
  "Spirited Away": "Spirited Away",
  Parasite: "Parasite (2019 film)",
  Whiplash: "Whiplash (2014 film)",
  "The Prestige": "The Prestige (film)",
  "The Departed": "The Departed",
  "Back to the Future": "Back to the Future",
  Alien: "Alien (film)",
  "The Shining": "The Shining (film)",
  "Mad Max: Fury Road": "Mad Max: Fury Road",
  "La La Land": "La La Land",
  "Toy Story": "Toy Story",
  "Jurassic Park": "Jurassic Park (film)",
  "The Grand Budapest Hotel": "The Grand Budapest Hotel",
  "12 Angry Men": "12 Angry Men (1957 film)",
  "Schindler's List": "Schindler's List",
  "The Lord of the Rings: The Fellowship of the Ring":
    "The Lord of the Rings: The Fellowship of the Ring",
};

// The API wants a descriptive UA; the image CDN rejects non-browser UAs.
const API_UA =
  "FeedlesLearning/1.0 (https://github.com/feedles/feedles; feedles@example.com)";
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const BACKOFF_MS = [5000, 15000, 30000];

async function fetchImage(url: string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": BROWSER_UA, Referer: "https://en.wikipedia.org/" },
    });

    if (res.status !== 429 || attempt >= BACKOFF_MS.length) {
      return res;
    }

    const wait = BACKOFF_MS[attempt];
    console.log(`     429 — retrying in ${wait / 1000}s…`);
    await new Promise((r) => setTimeout(r, wait));
  }
}

async function existingPoster(id: number): Promise<string | null> {
  for (const ext of ["jpg", "png", "webp"]) {
    const file = `public/posters/${id}.${ext}`;
    try {
      const info = await stat(file);
      if (info.size > 1000) return file;
    } catch {
      // not present
    }
  }
  return null;
}

const rows = await sql<
  { id: number; title: string }[]
>`select id, title from movies order by id`;

if (!dry) {
  await mkdir("public/posters", { recursive: true });
}

for (const row of rows) {
  const page = WIKI[row.title];

  if (!page) {
    console.log(`SKIP  ${row.title}: no wiki mapping`);
    continue;
  }

  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page)}`,
    { headers: { "User-Agent": API_UA, Accept: "application/json" } },
  );

  if (!res.ok) {
    console.log(`FAIL  ${row.title}: HTTP ${res.status}`);
    continue;
  }

  const json = (await res.json()) as {
    title?: string;
    originalimage?: { source: string };
    thumbnail?: { source: string };
  };

  const source = json.originalimage?.source ?? json.thumbnail?.source;

  if (!source) {
    console.log(`NOIMG ${row.title}`);
    continue;
  }

  const ext = new URL(source).pathname.endsWith(".png") ? "png" : "jpg";
  const file = `public/posters/${row.id}.${ext}`;
  const dbPath = `/posters/${row.id}.${ext}`;

  if (dry) {
    console.log(`[dry] ${String(row.id).padStart(2)}  ${row.title} -> ${json.title}`);
    continue;
  }

  const already = await existingPoster(row.id);

  if (already) {
    await sql`update movies set poster_path = ${`/${already.replace("public/", "")}`} where id = ${row.id}`;
    console.log(`have  ${String(row.id).padStart(2)}  ${row.title}`);
    continue;
  }

  const img = await fetchImage(source);
  const contentType = img.headers.get("content-type") ?? "";

  if (!img.ok || !contentType.startsWith("image/")) {
    console.log(`DLFAIL ${row.title}: HTTP ${img.status} ${contentType}`);
    continue;
  }

  await writeFile(file, Buffer.from(await img.arrayBuffer()));
  await sql`update movies set poster_path = ${dbPath} where id = ${row.id}`;
  console.log(`saved ${String(row.id).padStart(2)}  ${row.title}`);

  await new Promise((r) => setTimeout(r, 1200));
}

await sql.end();
