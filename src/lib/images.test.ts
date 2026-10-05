import { describe, expect, it } from "vitest";
import { placeholderPath, posterUrl } from "./images";

describe("placeholderPath", () => {
  it("uses + for spaces and keeps the .png extension", () => {
    expect(placeholderPath("Spider Man")).toBe(
      "/342x513/1e293b/e2e8f0.png?text=Spider+Man",
    );
  });

  it("percent-encodes special characters", () => {
    const path = placeholderPath("Amélie & Co");
    expect(path.startsWith("/342x513/1e293b/e2e8f0.png?text=")).toBe(true);
    expect(path).not.toContain(" ");
    expect(path).toContain("%26"); // encoded &
  });
});

describe("posterUrl", () => {
  it("returns the stored path when present", () => {
    expect(posterUrl("/posters/dune.jpg", "Dune")).toBe("/posters/dune.jpg");
  });

  it("falls back to placehold.co when there is no poster", () => {
    expect(posterUrl(null, "Dune")).toBe(
      "https://placehold.co/342x513/1e293b/e2e8f0.png?text=Dune",
    );
  });
});
