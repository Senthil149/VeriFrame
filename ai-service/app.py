from flask import Flask, request, jsonify
from flask_cors import CORS

from tensorflow.keras.models import load_model

from utils.preprocess import preprocess_image
from semantic_analyzer import analyze_semantics

import os
import pickle


app = Flask(__name__)
CORS(app)


# =====================================================
# PATHS
# =====================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# =====================================================
# LOAD DEEPFAKE MODEL
# =====================================================

deepfake_model_path = os.path.join(
    BASE_DIR,
    "deepfake_model.keras"
)


deepfake_model = load_model(
    deepfake_model_path
)


print(
    "✅ Deepfake AI Model Loaded Successfully"
)


# =====================================================
# LOAD FAKE NEWS MODEL
# =====================================================

news_model_path = os.path.join(
    BASE_DIR,
    "news_model.pkl"
)


try:

    with open(
        news_model_path,
        "rb"
    ) as file:

        news_model_data = pickle.load(
            file
        )


    news_model = news_model_data[
        "model"
    ]

    news_vectorizer = news_model_data[
        "vectorizer"
    ]


    print(
        "✅ Fake News AI Model Loaded Successfully"
    )


except Exception as error:

    news_model = None

    news_vectorizer = None

    print(
        "❌ Failed to load Fake News model:"
    )

    print(error)


# =====================================================
# UPLOAD DIRECTORY
# =====================================================

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)


os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# =====================================================
# HEALTH CHECK
# =====================================================

@app.route("/", methods=["GET"])
def health_check():

    return jsonify({

        "success": True,

        "message":
            "VeriFrame AI Service is running",

        "deepfakeModel":
            deepfake_model is not None,

        "fakeNewsModel":
            news_model is not None,

    })


# =====================================================
# ANALYZE IMAGE
# =====================================================

@app.route(
    "/analyze",
    methods=["POST"]
)
def analyze():

    try:

        # =============================================
        # CHECK IMAGE
        # =============================================

        if "image" not in request.files:

            return jsonify({

                "success": False,

                "message":
                    "No image uploaded"

            }), 400


        image = request.files[
            "image"
        ]


        if not image.filename:

            return jsonify({

                "success": False,

                "message":
                    "Invalid image filename"

            }), 400


        # =============================================
        # SAVE IMAGE
        # =============================================

        image_path = os.path.join(
            UPLOAD_FOLDER,
            image.filename
        )


        image.save(
            image_path
        )


        print(
            "🖼️ Image received:",
            image.filename
        )


        # =============================================
        # PREPROCESS IMAGE
        # =============================================

        processed = preprocess_image(
            image_path
        )


        # =============================================
        # DEEPFAKE PREDICTION
        # =============================================

        prediction = deepfake_model.predict(
            processed,
            verbose=0
        )


        confidence = float(
            prediction[0][0]
        )


        # =============================================
        # CLASSIFICATION
        # =============================================

        if confidence >= 0.5:

            result = "REAL"

        else:

            result = "FAKE"


        # =============================================
        # SEMANTIC ANALYSIS
        # =============================================

        print(
            "🧠 Running Semantic Analysis..."
        )


        semantic_result = analyze_semantics(
            image_path
        )


        if semantic_result["success"]:

            semantic_description = (
                semantic_result["description"]
            )

        else:

            semantic_description = None


            print(
                "⚠️ Semantic Analysis Failed:",
                semantic_result.get(
                    "message"
                )
            )


        # =============================================
        # FINAL IMAGE RESPONSE
        # =============================================

        return jsonify({

            "success": True,


            # =========================================
            # DEEPFAKE RESULT
            # =========================================

            "prediction":
                result,

            "confidence":
                round(
                    confidence * 100,
                    2
                ),


            # =========================================
            # SEMANTIC ANALYSIS
            # =========================================

            "semanticAnalysis": {

                "success":
                    semantic_result[
                        "success"
                    ],

                "description":
                    semantic_description,

            },

        })


    except Exception as error:

        print(
            "❌ Image Analysis Error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Image analysis failed",

            "error":
                str(error),

        }), 500


# =====================================================
# ANALYZE FAKE NEWS
# =====================================================

@app.route(
    "/analyze-news",
    methods=["POST"]
)
def analyze_news():

    try:

        # =============================================
        # CHECK MODEL
        # =============================================

        if (
            news_model is None
            or news_vectorizer is None
        ):

            return jsonify({

                "success": False,

                "message":
                    "Fake News AI model is not available"

            }), 500


        # =============================================
        # GET NEWS TEXT
        # =============================================

        data = request.get_json(
            silent=True
        )


        if not data:

            return jsonify({

                "success": False,

                "message":
                    "Request body is required"

            }), 400


        text = data.get(
            "text",
            ""
        )


        # =============================================
        # VALIDATE TEXT
        # =============================================

        if not isinstance(
            text,
            str
        ):

            return jsonify({

                "success": False,

                "message":
                    "News content must be text"

            }), 400


        text = text.strip()


        if not text:

            return jsonify({

                "success": False,

                "message":
                    "News content is required"

            }), 400


        print(
            "📰 News received for analysis"
        )


        # =============================================
        # TF-IDF TRANSFORMATION
        # =============================================

        news_features = (
            news_vectorizer.transform(
                [text]
            )
        )


        # =============================================
        # PREDICTION
        # =============================================

        prediction = news_model.predict(
            news_features
        )[0]


        # =============================================
        # CONFIDENCE
        # =============================================

        probabilities = (
            news_model.predict_proba(
                news_features
            )[0]
        )


        confidence = float(
            max(probabilities)
        )


        # =============================================
        # LABEL
        # =============================================

        if prediction == 0:

            result = "FAKE"

        else:

            result = "REAL"


        # =============================================
        # RESPONSE MESSAGE
        # =============================================

        if result == "FAKE":

            message = (
                "The AI model classified "
                "this news content as potentially "
                "FAKE. Verify the source before "
                "trusting or sharing it."
            )

        else:

            message = (
                "The AI model classified "
                "this news content as potentially "
                "REAL based on the trained dataset. "
                "Important claims should still be "
                "verified with reliable sources."
            )


        print(
            "📰 Prediction:",
            result
        )


        print(
            "📊 Confidence:",
            round(
                confidence * 100,
                2
            )
        )


        # =============================================
        # FINAL NEWS RESPONSE
        # =============================================

        return jsonify({

            "success": True,

            "prediction":
                result,

            "confidence":
                round(
                    confidence * 100,
                    2
                ),

            "message":
                message,

        })


    except Exception as error:

        print(
            "❌ Fake News Analysis Error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Fake news analysis failed",

            "error":
                str(error),

        }), 500


# =====================================================
# START SERVER
# =====================================================

if __name__ == "__main__":

    print(
        "🚀 Starting VeriFrame AI Service..."
    )

    print(
        "🧠 Deepfake Model:",
        "READY"
        if deepfake_model
        else "NOT READY"
    )

    print(
        "📰 Fake News Model:",
        "READY"
        if news_model
        else "NOT READY"
    )


    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )