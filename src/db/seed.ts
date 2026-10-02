import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { genres, movies, moviesGenres } from "./schema";

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client);

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
];

type SeedMovie = {
  title: string;
  releaseYear: number;
  overview: string;
  runtime: number;
  rating: string;
  genres: string[];
};

const MOVIES: SeedMovie[] = [
  {
    title: "The Shawshank Redemption",
    releaseYear: 1994,
    runtime: 142,
    rating: "9.3",
    genres: ["Drama"],
    overview:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  },
  {
    title: "The Godfather",
    releaseYear: 1972,
    runtime: 175,
    rating: "9.2",
    genres: ["Crime", "Drama"],
    overview:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  },
  {
    title: "The Dark Knight",
    releaseYear: 2008,
    runtime: 152,
    rating: "9.0",
    genres: ["Action", "Crime", "Drama"],
    overview:
      "When the menace known as the Joker emerges, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
  {
    title: "Pulp Fiction",
    releaseYear: 1994,
    runtime: 154,
    rating: "8.9",
    genres: ["Crime", "Drama"],
    overview:
      "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
  },
  {
    title: "Forrest Gump",
    releaseYear: 1994,
    runtime: 142,
    rating: "8.8",
    genres: ["Drama", "Romance"],
    overview:
      "The presidencies of Kennedy and Johnson, Vietnam, Watergate and other history unfold through the perspective of an Alabama man with an IQ of 75.",
  },
  {
    title: "Inception",
    releaseYear: 2010,
    runtime: 148,
    rating: "8.8",
    genres: ["Action", "Adventure", "Science Fiction"],
    overview:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into a CEO's mind.",
  },
  {
    title: "The Matrix",
    releaseYear: 1999,
    runtime: 136,
    rating: "8.7",
    genres: ["Action", "Science Fiction"],
    overview:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
  },
  {
    title: "Goodfellas",
    releaseYear: 1990,
    runtime: 145,
    rating: "8.7",
    genres: ["Crime", "Drama"],
    overview:
      "The story of Henry Hill and his life in the mob, covering his relationship with his wife and his mob partners.",
  },
  {
    title: "Se7en",
    releaseYear: 1995,
    runtime: 127,
    rating: "8.6",
    genres: ["Crime", "Mystery", "Thriller"],
    overview:
      "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
  },
  {
    title: "The Silence of the Lambs",
    releaseYear: 1991,
    runtime: 118,
    rating: "8.6",
    genres: ["Crime", "Thriller"],
    overview:
      "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to catch another serial killer.",
  },
  {
    title: "Interstellar",
    releaseYear: 2014,
    runtime: 169,
    rating: "8.7",
    genres: ["Adventure", "Drama", "Science Fiction"],
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
  {
    title: "The Green Mile",
    releaseYear: 1999,
    runtime: 189,
    rating: "8.6",
    genres: ["Crime", "Drama", "Fantasy"],
    overview:
      "The lives of guards on death row are affected by one of their charges: a black man accused of child murder, yet who has a mysterious gift.",
  },
  {
    title: "Gladiator",
    releaseYear: 2000,
    runtime: 155,
    rating: "8.5",
    genres: ["Action", "Adventure", "Drama"],
    overview:
      "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
  },
  {
    title: "The Lion King",
    releaseYear: 1994,
    runtime: 88,
    rating: "8.5",
    genres: ["Animation", "Adventure", "Family"],
    overview:
      "Lion prince Simba flees his kingdom after the murder of his father, only to learn the true meaning of responsibility and bravery.",
  },
  {
    title: "Spirited Away",
    releaseYear: 2001,
    runtime: 125,
    rating: "8.6",
    genres: ["Animation", "Adventure", "Family", "Fantasy"],
    overview:
      "During her family's move to the suburbs, a sullen girl wanders into a world ruled by gods, witches and spirits.",
  },
  {
    title: "Parasite",
    releaseYear: 2019,
    runtime: 132,
    rating: "8.5",
    genres: ["Comedy", "Drama", "Thriller"],
    overview:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
  },
  {
    title: "Whiplash",
    releaseYear: 2014,
    runtime: 106,
    rating: "8.5",
    genres: ["Drama", "Music"],
    overview:
      "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.",
  },
  {
    title: "The Prestige",
    releaseYear: 2006,
    runtime: 130,
    rating: "8.5",
    genres: ["Drama", "Mystery", "Thriller"],
    overview:
      "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have.",
  },
  {
    title: "The Departed",
    releaseYear: 2006,
    runtime: 151,
    rating: "8.5",
    genres: ["Crime", "Drama", "Thriller"],
    overview:
      "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in Boston.",
  },
  {
    title: "Back to the Future",
    releaseYear: 1985,
    runtime: 116,
    rating: "8.5",
    genres: ["Adventure", "Comedy", "Science Fiction"],
    overview:
      "Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean.",
  },
  {
    title: "Alien",
    releaseYear: 1979,
    runtime: 117,
    rating: "8.5",
    genres: ["Horror", "Science Fiction"],
    overview:
      "The crew of a commercial spacecraft encounters a deadly lifeform after investigating an unknown transmission.",
  },
  {
    title: "The Shining",
    releaseYear: 1980,
    runtime: 146,
    rating: "8.4",
    genres: ["Drama", "Horror"],
    overview:
      "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.",
  },
  {
    title: "Mad Max: Fury Road",
    releaseYear: 2015,
    runtime: 120,
    rating: "8.1",
    genres: ["Action", "Adventure", "Science Fiction"],
    overview:
      "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners.",
  },
  {
    title: "La La Land",
    releaseYear: 2016,
    runtime: 128,
    rating: "8.0",
    genres: ["Comedy", "Drama", "Music", "Romance"],
    overview:
      "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.",
  },
  {
    title: "Toy Story",
    releaseYear: 1995,
    runtime: 81,
    rating: "8.3",
    genres: ["Animation", "Adventure", "Comedy", "Family"],
    overview:
      "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
  },
  {
    title: "Jurassic Park",
    releaseYear: 1993,
    runtime: 127,
    rating: "8.2",
    genres: ["Adventure", "Science Fiction", "Thriller"],
    overview:
      "A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
  },
  {
    title: "The Grand Budapest Hotel",
    releaseYear: 2014,
    runtime: 99,
    rating: "8.1",
    genres: ["Adventure", "Comedy", "Crime"],
    overview:
      "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy under an exceptional concierge.",
  },
  {
    title: "12 Angry Men",
    releaseYear: 1957,
    runtime: 96,
    rating: "9.0",
    genres: ["Crime", "Drama"],
    overview:
      "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.",
  },
  {
    title: "Schindler's List",
    releaseYear: 1993,
    runtime: 195,
    rating: "9.0",
    genres: ["Drama", "History", "War"],
    overview:
      "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.",
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    releaseYear: 2001,
    runtime: 178,
    rating: "8.9",
    genres: ["Adventure", "Drama", "Fantasy"],
    overview:
      "A meek Hobbit and eight companions set out on a journey to destroy the One Ring and the Dark Lord Sauron.",
  },
];

async function main() {
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`TRUNCATE TABLE ${moviesGenres}, ${movies}, ${genres} RESTART IDENTITY CASCADE`,
    );

    const insertedGenres = await tx
      .insert(genres)
      .values(GENRES.map((name) => ({ name })))
      .returning();

    const genreIdByName = new Map(insertedGenres.map((g) => [g.name, g.id]));

    const insertedMovies = await tx
      .insert(movies)
      .values(
        MOVIES.map((m) => ({
          title: m.title,
          releaseYear: m.releaseYear,
          overview: m.overview,
          runtime: m.runtime,
          rating: m.rating,
        })),
      )
      .returning({ id: movies.id, title: movies.title });

    const movieIdByTitle = new Map(
      insertedMovies.map((m) => [m.title, m.id]),
    );

    const links = MOVIES.flatMap((m) => {
      const movieId = movieIdByTitle.get(m.title)!;
      return m.genres.map((name) => ({
        movieId,
        genreId: genreIdByName.get(name)!,
      }));
    });

    await tx.insert(moviesGenres).values(links);
  });

  const [{ count: movieCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(movies);
  const [{ count: genreCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(genres);

  console.log(
    `Seeded ${movieCount} movies and ${genreCount} genres.`,
  );
}

main()
  .then(() => client.end())
  .catch(async (err) => {
    console.error(err);
    await client.end();
    process.exit(1);
  });
