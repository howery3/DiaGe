import { Router } from "express";

const router = Router();

router.get("/places/nearby", async (req, res) => {
  const { query, lat, lng } = req.query as Record<string, string>;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    res.status(503).json({ error: "Places API not configured" });
    return;
  }
  if (!query || !lat || !lng) {
    res.status(400).json({ error: "query, lat, and lng are required" });
    return;
  }

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/textsearch/json"
    );
    url.searchParams.set("query", `${query} jewelry`);
    url.searchParams.set("location", `${lat},${lng}`);
    url.searchParams.set("radius", "48280"); // 30 miles in meters
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      status: string;
      results?: {
        place_id: string;
        name: string;
        formatted_address: string;
        rating?: number;
        geometry: { location: { lat: number; lng: number } };
      }[];
    };

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      req.log.error({ status: data.status }, "Google Places API error");
      res.status(502).json({ error: "Places API error", status: data.status });
      return;
    }

    const places = (data.results ?? []).slice(0, 5).map((p) => ({
      placeId: p.place_id,
      name: p.name,
      address: p.formatted_address,
      rating: p.rating,
      lat: p.geometry?.location?.lat,
      lng: p.geometry?.location?.lng,
    }));

    res.json({ places });
  } catch (err) {
    req.log.error(err, "Places API fetch error");
    res.status(500).json({ error: "Failed to fetch nearby stores" });
  }
});

router.get("/places/details/:placeId", async (req, res) => {
  const { placeId } = req.params;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    res.status(503).json({ error: "Places API not configured" });
    return;
  }

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json"
    );
    url.searchParams.set("place_id", placeId);
    url.searchParams.set(
      "fields",
      "name,formatted_phone_number,website,formatted_address"
    );
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString());
    const data = (await response.json()) as {
      status: string;
      result?: {
        name: string;
        formatted_phone_number?: string;
        website?: string;
        formatted_address?: string;
      };
    };

    if (data.status !== "OK") {
      res.status(502).json({ error: "Place not found" });
      return;
    }

    res.json({
      name: data.result?.name,
      phone: data.result?.formatted_phone_number,
      website: data.result?.website,
      address: data.result?.formatted_address,
    });
  } catch (err) {
    req.log.error(err, "Place details fetch error");
    res.status(500).json({ error: "Failed to fetch place details" });
  }
});

export default router;
