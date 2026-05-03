# spotify-recommender-prototype

A complete, dockerized Machine Learning application that provides personalized music recommendations. It combines Collaborative Filtering (ALS) and Content-Based Filtering (TF-IDF) with a high-performance FastAPI backend and a React frontend.

## 🚀 Key Features
* **Hybrid Recommendation Engine:** Uses Alternating Least Squares (ALS) for user-based collaborative filtering and TF-IDF with Cosine Similarity for content-based track matching.
* **FastAPI Backend:** Provides fast, asynchronous RESTful endpoints for model inference in real-time.
* **React Web Client:** Interactive UI allowing users to search for tracks, add them to favorites, and get instant recommendations based on their selections.
* **Data Evaluation & Visualization:** Includes a dedicated evaluation module (`evaluate.py`) that performs Z-score anomaly detection, builds confusion matrices, and visualizes training loss/accuracy metrics.
* **Containerized Deployment:** Fully dockerized environment using Docker Compose for seamless deployment of both frontend and backend services.

## 🛠️ Tech Stack
* **Machine Learning & Data:** Python, Pandas, NumPy, scikit-learn, Implicit (ALS), SciPy.
* **Backend:** FastAPI, Uvicorn.
* **Frontend:** React, Vite.
* **DevOps:** Docker, Docker Compose.

## 🧠 System Architecture
1. **Model Training (`train_models.py`):** Preprocesses the Spotify dataset, computes TF-IDF matrices, trains the ALS model on synthetic user behavior, and exports the models via `joblib`.
2. **Inference API (`main.py`):** Loads the pre-trained models into memory and exposes endpoints like `/recommend/{user_id}` and `/search`.
3. **Analytics (`evaluate.py`):** Provides detailed insights into text length distributions, Top TF-IDF words, and classification performance.

## ⚙️ How to Run
Ensure you have Docker and Docker Compose installed.

1. Clone the repository.
2. Place the dataset `spotify_millsongdata.csv` in the `backend/data` directory.
3. Build and start the containers:
   ```bash
   docker-compose up --build
