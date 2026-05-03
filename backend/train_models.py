import argparse
import pandas as pd
import numpy as np
import scipy.sparse as sp
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from implicit.als import AlternatingLeastSquares


def build_content_model(df, out_dir):
    # Combine fields into a text string
    df['content'] = df['artist'].fillna('') + ' ' + df['song'].fillna('') + ' ' + df['text'].fillna('')
    vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['content'])
    joblib.dump((vectorizer, tfidf_matrix, df), f"{out_dir}/tfidf.pkl")
    print("[OK] TF-IDF model saved")


def build_cf_model(df, out_dir, factors=64, iterations=15):
    # Normalize link field
    df['link'] = df['link'].astype(str).str.strip()

    # Create synthetic user IDs
    np.random.seed(42)
    df['user_id'] = np.random.randint(0, 100, size=len(df))
    df['plays'] = 1

    # Maps
    user_map = {f"U{u}": i for i, u in enumerate(df['user_id'].unique())}
    item_map = {t: i for i, t in enumerate(df['link'].unique())}

    rows = df['user_id'].map({u: i for i, u in enumerate(df['user_id'].unique())})
    cols = df['link'].map(item_map)
    data = df['plays'].astype(float)

    user_item = sp.coo_matrix((data, (rows, cols)), shape=(len(user_map), len(item_map))).tocsr()

    model = AlternatingLeastSquares(factors=factors, iterations=iterations)
    model.fit(user_item)

    np.savez(f"{out_dir}/als_model.npz", user_factors=model.user_factors, item_factors=model.item_factors)
    np.savez(f"{out_dir}/mappings.npz", user_map=user_map, item_map=item_map)
    print("[OK] ALS model saved")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', required=True)
    parser.add_argument('--out', required=True)
    parser.add_argument('--factors', type=int, default=64)
    parser.add_argument('--iterations', type=int, default=15)
    args = parser.parse_args()

    df = pd.read_csv(args.data)

    build_content_model(df, args.out)
    build_cf_model(df, args.out, args.factors, args.iterations)


if __name__ == "__main__":
    main()
