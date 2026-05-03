import React, { useState } from "react";
import { fetchRecommendations, search, fetchRecsFromTracks } from "./api";

export default function App() {
  const [userId, setUserId] = useState("U1");
  const [k, setK] = useState(10);
  const [recs, setRecs] = useState([]);
  const [q, setQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);

  async function getRecs() {
    try {
      const data = await fetchRecommendations(userId, k);
      setRecs(data || []);
    } catch (err) {
      alert(err.message);
    }
  }

  async function doSearch(e) {
    e.preventDefault();
    try {
      const r = await search(q, 70);
      setSearchResults(r || []);
    } catch (e) {
      alert("Search error");
    }
  }

  async function getRecsFromFavorites() {
    try {
      const data = await fetchRecsFromTracks(favorites, k);
      setRecs(data || []);
    } catch (err) {
      alert(err.message);
    }
  }

  function addToFavorites(track) {
    if (!favorites.includes(track.link)) {
      setFavorites([...favorites, track.link]);
    }
  }

  function removeFromFavorites(trackId) {
    setFavorites(favorites.filter(f => f !== trackId));
  }

  function TrackCard({ track, onAdd, onRemove, isFav }) {
    return (
      <div style={{
        background: "#181818",
        color: "white",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            {track.song}
          </div>
          <div style={{ fontSize: "12px", color: "#b3b3b3" }}>
            {track.artist}
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <a href={track.link} target="_blank" rel="noopener noreferrer"
             style={{ color: "#1DB954", fontSize: "12px", textDecoration: "none" }}>
            ▶ Play
          </a>
          {isFav ? (
            <button onClick={() => onRemove(track.link)}
              style={{ background: "transparent", border: "1px solid #b3b3b3", color: "white", borderRadius: "4px", cursor: "pointer", padding: "4px 8px" }}>
              Remove
            </button>
          ) : (
            <button onClick={() => onAdd(track)}
              style={{ background: "#1DB954", border: "none", borderRadius: "4px", cursor: "pointer", padding: "4px 8px", color: "white" }}>
              Add
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#121212", minHeight: "100vh", color: "white" }}>
      <h1 style={{ color: "#1DB954" }}>🎵 Spotify Recommender</h1>

      {/* Блок для користувацьких рекомендацій */}
      <div style={{ marginBottom: 20 }}>
        <label>User ID: </label>
        <input
          value={userId}
          onChange={e => setUserId(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <label>K: </label>
        <input
          type="number"
          value={k}
          onChange={e => setK(Number(e.target.value))}
          style={{ width: 60, marginLeft: 5, marginRight: 10 }}
        />
        <button onClick={getRecs}
          style={{ background: "#1DB954", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>
          Get User Recs
        </button>
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        {/* Рекомендації */}
        <div style={{ flex: 1 }}>
          <h3 style={{ borderBottom: "1px solid #333", paddingBottom: "5px" }}>Recommendations</h3>
          {recs.length === 0 ? (
            <div>No recommendations yet.</div>
          ) : (
            recs.map((r, idx) => (
              <TrackCard
                key={idx}
                track={r}
                onAdd={addToFavorites}
                onRemove={removeFromFavorites}
                isFav={favorites.includes(r.link)}
              />
            ))
          )}
        </div>

        {/* Пошук треків */}
        <div style={{ flex: 1 }}>
          <h3 style={{ borderBottom: "1px solid #333", paddingBottom: "5px" }}>Search Tracks</h3>
          <form onSubmit={doSearch} style={{ marginBottom: 10 }}>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="search by title/artist"
              style={{ padding: "6px", borderRadius: "4px", border: "1px solid #333", width: "70%" }}
            />
            <button type="submit"
              style={{ marginLeft: 8, background: "#1DB954", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>
              Search
            </button>
          </form>
          <div>
            {searchResults.map((s, i) => (
              <TrackCard
                key={i}
                track={s}
                onAdd={addToFavorites}
                onRemove={removeFromFavorites}
                isFav={favorites.includes(s.link)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Вибрані треки */}
      <div style={{ marginTop: 20 }}>
        <h3 style={{ borderBottom: "1px solid #333", paddingBottom: "5px" }}>Selected Tracks</h3>
        {favorites.length === 0 ? (
          <div>No tracks selected.</div>
        ) : (
          <ul>
            {favorites.map((f, i) => {
              const track = searchResults.find(s => s.link === f) || recs.find(r => r.link === f);
              return (
                <li key={i} style={{ marginBottom: "5px" }}>
                  {track ? `${track.song} — ${track.artist}` : f}
                </li>
              );
            })}
          </ul>
        )}
        {favorites.length > 0 && (
          <button onClick={getRecsFromFavorites}
            style={{ marginTop: 10, background: "#1DB954", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>
            Get Recs from Favorites
          </button>
        )}
      </div>
    </div>
  );
}
