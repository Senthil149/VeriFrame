from PIL import Image
import torch

from transformers import (
    AutoProcessor,
    BlipForConditionalGeneration,
)


# =====================================================
# MODEL NAME
# =====================================================

MODEL_NAME = "Salesforce/blip-image-captioning-base"


# =====================================================
# MODEL VARIABLES
# =====================================================

processor = None
model = None


# =====================================================
# LOAD BLIP MODEL ONLY WHEN NEEDED
# =====================================================

def get_semantic_model():

    global processor
    global model


    if processor is None or model is None:

        print(
            "🧠 Loading Semantic Analysis model..."
        )


        processor = AutoProcessor.from_pretrained(
            MODEL_NAME
        )


        model = (
            BlipForConditionalGeneration
            .from_pretrained(
                MODEL_NAME
            )
        )


        model.eval()


        print(
            "✅ Semantic Analysis model loaded successfully"
        )


    return processor, model


# =====================================================
# ANALYZE IMAGE
# =====================================================

def analyze_semantics(
    image_path
):

    try:

        # ---------------------------------------------
        # LOAD MODEL WHEN NEEDED
        # ---------------------------------------------

        processor, model = (
            get_semantic_model()
        )


        # ---------------------------------------------
        # OPEN IMAGE
        # ---------------------------------------------

        image = Image.open(
            image_path
        ).convert(
            "RGB"
        )


        # ---------------------------------------------
        # PREPARE IMAGE
        # ---------------------------------------------

        inputs = processor(
            images=image,
            return_tensors="pt"
        )


        # ---------------------------------------------
        # GENERATE DESCRIPTION
        # ---------------------------------------------

        with torch.no_grad():

            output = model.generate(
                **inputs,
                max_new_tokens=50
            )


        # ---------------------------------------------
        # CONVERT OUTPUT TO TEXT
        # ---------------------------------------------

        description = processor.decode(
            output[0],
            skip_special_tokens=True
        )


        return {

            "success": True,

            "description":
                description

        }


    except Exception as error:

        print(
            "❌ Semantic Analysis Error:",
            error
        )


        return {

            "success": False,

            "description": None,

            "message":
                str(error)

        }