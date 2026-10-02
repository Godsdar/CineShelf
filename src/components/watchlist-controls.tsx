import { SubmitButton } from "@/components/submit-button";
import {
  addToWatchlist,
  removeFromWatchlist,
  toggleWatched,
} from "@/lib/actions";

export function WatchlistControls({
  movieId,
  inWatchlist,
  watched,
}: {
  movieId: number;
  inWatchlist: boolean;
  watched: boolean;
}) {
  if (!inWatchlist) {
    return (
      <form action={addToWatchlist}>
        <input type="hidden" name="movieId" value={movieId} />
        <SubmitButton pendingLabel="Adding…">Add to Watchlist</SubmitButton>
      </form>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={toggleWatched}>
        <input type="hidden" name="movieId" value={movieId} />
        <SubmitButton variant={watched ? "secondary" : "primary"}>
          {watched ? "Mark as Unwatched" : "Mark as Watched"}
        </SubmitButton>
      </form>
      <form action={removeFromWatchlist}>
        <input type="hidden" name="movieId" value={movieId} />
        <SubmitButton variant="ghost" pendingLabel="Removing…">
          Remove
        </SubmitButton>
      </form>
    </div>
  );
}
