const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchRecommendations(userId, k=10){
  const res = await fetch(`${BASE}/recommend/${userId}?k=${k}`);
  if(!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}

export async function search(q, k=20){
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}&k=${k}`);
  if(!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function fetchRecsFromTracks(tracks, k=10) {
  const params = new URLSearchParams();
  tracks.forEach(t => params.append("ids", t)); // ids=link1&ids=link2
  params.append("k", k);

  const res = await fetch(`${BASE}/recommend_tracks?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch recommendations from tracks");
  return await res.json();
}

