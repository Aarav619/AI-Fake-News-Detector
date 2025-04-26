import streamlit as st
import pickle
import re
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords

# Load Model and Vectorizer
model = pickle.load(open('models/fake_news_model.pkl', 'rb'))
vectorizer = pickle.load(open('models/vectorizer.pkl', 'rb'))

stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = re.sub(r'[^a-zA-Z]', ' ', str(text))
    text = text.lower().split()
    text = [word for word in text if word not in stop_words]
    return ' '.join(text)

# Streamlit UI
st.set_page_config(page_title="Fake News Detector", layout="centered")
st.title("📰 Fake News Detector")
st.write("Enter news content or headline below to check if it's Real or Fake")

user_input = st.text_area("Enter News Content Here:")

if st.button("Check Now"):
    if user_input.strip() == "":
        st.warning("⚠️ Please enter some news content to check.")
    else:
        cleaned_input = clean_text(user_input)
        input_vector = vectorizer.transform([cleaned_input])
        prediction = model.predict(input_vector)[0]
        prediction_proba = model.predict_proba(input_vector)[0]

        real_score = prediction_proba[0] * 100
        fake_score = prediction_proba[1] * 100

        if prediction == 0:
            st.success(f"✅ REAL NEWS ({real_score:.2f}% confidence)")
        else:
            st.error(f"🚨 FAKE NEWS ({fake_score:.2f}% confidence)")

        st.write("#### Confidence Level:")
        st.progress(int(fake_score) if prediction == 1 else int(real_score))
