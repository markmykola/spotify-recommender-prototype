from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import joblib
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from fastapi import Query
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
vectorizer, tfidf_matrix, df = joblib.load("models/tfidf.pkl")
als = np.load("models/als_model.npz")
maps = np.load("models/mappings.npz", allow_pickle=True)

user_map = maps["user_map"].item()
item_map = maps["item_map"].item()

# Normalize links in df
df['link'] = df['link'].astype(str).str.strip()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/tracks/{track_id}")
def get_track(track_id: str):
    row = df[df['link'] == track_id].iloc[0]
    return row.to_dict()


@app.get("/search")
def search(q: str, k: int = 10):
    vec = vectorizer.transform([q])
    sims = cosine_similarity(vec, tfidf_matrix).flatten()
    top_idx = sims.argsort()[::-1][:k]
    results = df.iloc[top_idx][['artist', 'song', 'link']].to_dict(orient='records')
    return results


@app.get("/recommend/{user_id}")
def recommend(user_id: str, k: int = 10):
    if user_id not in user_map:
        return {"error": f"user_id {user_id} not found", "known_users": list(user_map.keys())[:20]}

    uid = user_map[user_id]
    user_factors = als['user_factors']
    item_factors = als['item_factors']

    scores = item_factors @ user_factors[uid]
    top_items = np.argsort(-scores)[:k]

    inv_item_map = {v: k for k, v in item_map.items()}
    recs = []
    for idx in top_items:
        track_id = inv_item_map[idx]
        matches = df[df['link'] == track_id]
        if matches.empty:
            print(f"[WARN] no match in df for track_id={track_id}")
            continue
        row = matches.iloc[0]
        recs.append(row[['artist', 'song', 'link']].to_dict())

    # Guarantee at least some results
    if not recs:
        recs = df.sample(min(k, len(df)))[['artist', 'song', 'link']].to_dict(orient="records")

    return recs

@app.get("/recommend_tracks")
def recommend_from_tracks(ids: list[str] = Query(...), k: int = 10):
    """Рекомендації на основі обраних треків"""
    mask = df['link'].isin(ids).to_numpy()
    if not mask.any():
        return {"error": "No tracks found in dataset for given ids"}

    # середнє векторне представлення для обраних треків
    vecs = tfidf_matrix[mask]
    mean_vec = vecs.mean(axis=0)  # ще csr_matrix
    mean_vec = mean_vec.A  # робимо np.ndarray (1, n_features)

    # схожість з усіма треками
    sims = cosine_similarity(mean_vec, tfidf_matrix).flatten()

    # сортуємо і прибираємо самі обрані треки
    top_idx = sims.argsort()[::-1]
    top_idx = [i for i in top_idx if df.iloc[i]['link'] not in ids][:k]

    results = df.iloc[top_idx][['artist', 'song', 'link']].to_dict(orient='records')
    return results


print("Loaded users:", list(user_map.keys())[:20])
print("Loaded items:", list(item_map.keys())[:20])