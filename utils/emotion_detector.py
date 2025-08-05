from transformers import pipeline

# Load emotion detection pipeline
emotion_pipeline = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1  
)

def detect_emotion(text: str) -> str:
    result = emotion_pipeline(text)
    
    # When top_k=1 -> result is a list with 1 dict
    if isinstance(result, list) and isinstance(result[0], dict):
        label = result[0]['label']
        score = result[0]['score']
        return f"{label} ({score:.2f})"
    
    # When top_k=None -> result is a list of dicts
    elif isinstance(result, list) and isinstance(result[0], list):
        top_result = result[0][0]
        label = top_result['label']
        score = top_result['score']
        return f"{label} ({score:.2f})"

    else:
        return "Unknown"
