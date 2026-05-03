# 📁 Dataset Information: Spotify Million Song Dataset

Цей файл є заглушкою. Оригінальний файл `spotify_millsongdata.csv` має великий розмір, тому він не включений до цього репозиторію через обмеження GitHub.

## 🔗 Де завантажити датасет
Ви можете безкоштовно завантажити оригінальний датасет з платформи Kaggle за цим посиланням:
👉 [Spotify Million Song Dataset (Kaggle)](https://www.kaggle.com/datasets/notshrirang/spotify-million-song-dataset)

## ⚙️ Як налаштувати дані для запуску проєкту
1. Перейдіть за посиланням вище та завантажте архів з даними.
2. Розпакуйте архів.
3. Переконайтеся, що файл має назву `spotify_millsongdata.csv`.
4. Помістіть цей файл у цю ж директорію (`backend/data/`).

*Примітка: Docker-контейнер налаштований на автоматичне зчитування файлу `spotify_millsongdata.csv` з цієї папки.*

## 📊 Структура даних (Schema)
Для коректної роботи алгоритмів рекомендацій та аналітики (скрипти `train_models.py` та `evaluate.py`), CSV-файл обов'язково повинен містити наступні колонки:
* `artist` — ім'я виконавця (string).
* `song` — назва пісні (string).
* `link` — унікальне посилання або ідентифікатор треку (string/URL).
* `text` — текст пісні для NLP аналізу та TF-IDF (string).
