import pandas as pd
import os
import pickle

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# =====================================================
# PATHS
# =====================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)


DATASET_DIR = os.path.join(
    BASE_DIR,
    "datasets"
)


MODEL_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


FAKE_FILE = os.path.join(
    DATASET_DIR,
    "Fake.csv"
)


TRUE_FILE = os.path.join(
    DATASET_DIR,
    "True.csv"
)


MODEL_FILE = os.path.join(
    MODEL_DIR,
    "news_model.pkl"
)


# =====================================================
# CHECK DATASET
# =====================================================

print(
    "📂 Loading Fake News dataset..."
)


if not os.path.exists(FAKE_FILE):

    raise FileNotFoundError(
        f"Fake.csv not found: {FAKE_FILE}"
    )


if not os.path.exists(TRUE_FILE):

    raise FileNotFoundError(
        f"True.csv not found: {TRUE_FILE}"
    )


# =====================================================
# LOAD DATA
# =====================================================

fake_data = pd.read_csv(
    FAKE_FILE
)


true_data = pd.read_csv(
    TRUE_FILE
)


print(
    "✅ Fake articles:",
    len(fake_data)
)


print(
    "✅ Real articles:",
    len(true_data)
)


# =====================================================
# CREATE LABELS
# =====================================================

# IMPORTANT:
#
# 0 = FAKE
# 1 = REAL
#

fake_data["label"] = 0

true_data["label"] = 1


# =====================================================
# KEEP ONLY REQUIRED COLUMNS
# =====================================================

fake_data = fake_data[
    ["title", "text", "label"]
]


true_data = true_data[
    ["title", "text", "label"]
]


# =====================================================
# COMBINE DATA
# =====================================================

data = pd.concat(
    [
        fake_data,
        true_data
    ],
    ignore_index=True
)


# =====================================================
# HANDLE MISSING VALUES
# =====================================================

data["title"] = (
    data["title"]
    .fillna("")
    .astype(str)
)


data["text"] = (
    data["text"]
    .fillna("")
    .astype(str)
)


# =====================================================
# REMOVE EMPTY ARTICLES
# =====================================================

data = data[
    data["text"].str.strip() != ""
]


# =====================================================
# REMOVE DUPLICATES
# =====================================================

before_duplicates = len(data)


data = data.drop_duplicates(
    subset=["text"]
)


removed_duplicates = (
    before_duplicates -
    len(data)
)


print(
    "🧹 Duplicate articles removed:",
    removed_duplicates
)


# =====================================================
# CREATE CONTENT
# =====================================================

# IMPORTANT:
#
# The frontend currently sends the article BODY.
#
# Therefore the model should primarily learn
# from the article text instead of requiring
# the title.
#

data["content"] = (
    data["text"]
    .str.strip()
)


# =====================================================
# FINAL EMPTY CHECK
# =====================================================

data = data[
    data["content"].str.strip() != ""
]


print(
    "📊 Total usable articles:",
    len(data)
)


print(
    "\n📊 Label distribution:"
)


print(
    data["label"].value_counts()
)


# =====================================================
# FEATURES / LABELS
# =====================================================

X = data["content"]

y = data["label"]


# =====================================================
# TRAIN / TEST SPLIT
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.20,

    random_state=42,

    stratify=y

)


print(
    "\n📚 Training samples:",
    len(X_train)
)


print(
    "🧪 Testing samples:",
    len(X_test)
)


# =====================================================
# TF-IDF
# =====================================================

print(
    "\n🧠 Creating TF-IDF features..."
)


vectorizer = TfidfVectorizer(

    stop_words="english",

    max_features=100000,

    ngram_range=(1, 2),

    sublinear_tf=True,

    min_df=2

)


X_train_tfidf = (
    vectorizer.fit_transform(
        X_train
    )
)


X_test_tfidf = (
    vectorizer.transform(
        X_test
    )
)


print(
    "✅ TF-IDF completed."
)


print(
    "📐 Feature count:",
    len(vectorizer.get_feature_names_out())
)


# =====================================================
# TRAIN MODEL
# =====================================================

print(
    "\n🤖 Training Fake News classifier..."
)


model = LogisticRegression(

    max_iter=1000,

    random_state=42

)


model.fit(

    X_train_tfidf,

    y_train

)


print(
    "✅ Model training completed."
)


# =====================================================
# TEST MODEL
# =====================================================

predictions = model.predict(
    X_test_tfidf
)


# =====================================================
# ACCURACY
# =====================================================

accuracy = accuracy_score(

    y_test,

    predictions

)


print(
    "\n=========================================="
)


print(
    "📊 MODEL ACCURACY:",
    round(
        accuracy * 100,
        2
    ),
    "%"
)


print(
    "=========================================="
)


# =====================================================
# CLASSIFICATION REPORT
# =====================================================

print(
    "\n📋 Classification Report:\n"
)


print(
    classification_report(

        y_test,

        predictions,

        target_names=[
            "FAKE",
            "REAL"
        ]

    )
)


# =====================================================
# SANITY CHECK
# =====================================================

print(
    "\n=========================================="
)


print(
    "🔎 SANITY CHECK"
)


print(
    "=========================================="
)


# Get a few known REAL articles
real_samples = (
    true_data["text"]
    .fillna("")
    .astype(str)
    .loc[
        lambda x: x.str.strip() != ""
    ]
    .head(3)
)


# Get a few known FAKE articles
fake_samples = (
    fake_data["text"]
    .fillna("")
    .astype(str)
    .loc[
        lambda x: x.str.strip() != ""
    ]
    .head(3)
)


# -----------------------------------------
# REAL samples
# -----------------------------------------

print(
    "\n🟢 Known REAL articles:"
)


for index, article in enumerate(
    real_samples,
    start=1
):

    features = vectorizer.transform(
        [article]
    )


    prediction = model.predict(
        features
    )[0]


    probabilities = model.predict_proba(
        features
    )[0]


    confidence = (
        probabilities[prediction]
        * 100
    )


    result = (
        "REAL"
        if prediction == 1
        else "FAKE"
    )


    print(
        f"REAL sample {index}: "
        f"{result} "
        f"({confidence:.2f}%)"
    )


# -----------------------------------------
# FAKE samples
# -----------------------------------------

print(
    "\n🔴 Known FAKE articles:"
)


for index, article in enumerate(
    fake_samples,
    start=1
):

    features = vectorizer.transform(
        [article]
    )


    prediction = model.predict(
        features
    )[0]


    probabilities = model.predict_proba(
        features
    )[0]


    confidence = (
        probabilities[prediction]
        * 100
    )


    result = (
        "REAL"
        if prediction == 1
        else "FAKE"
    )


    print(
        f"FAKE sample {index}: "
        f"{result} "
        f"({confidence:.2f}%)"
    )


# =====================================================
# SAVE MODEL + VECTORIZER
# =====================================================

model_data = {

    "model":
        model,

    "vectorizer":
        vectorizer,

    "labels": {

        0: "FAKE",

        1: "REAL"

    },

    "feature_type":
        "article_text_only",

}


with open(
    MODEL_FILE,
    "wb"
) as file:

    pickle.dump(

        model_data,

        file

    )


print(
    "\n💾 Model saved successfully!"
)


print(
    "📁 Location:",
    MODEL_FILE
)


print(
    "\n🎉 Fake News AI training completed!"
)