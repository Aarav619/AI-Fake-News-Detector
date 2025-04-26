import streamlit as st
import pickle
import re

# Load the vectorizer and model
with open('models/vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

with open('models/fake_news_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Clean the text similar to training
def clean_text(text):
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    text = text.lower()
    text = text.split()
    return ' '.join(text)

# Streamlit UI
st.title('📰 Fake News Detector')
st.write("Enter the News content below 👇")

user_input = st.text_area("News Content")

if st.button("Predict"):
    if user_input.strip() == "":
        st.warning("Please enter some news content.")
    else:
        cleaned_input = clean_text(user_input)
        vectorized_input = vectorizer.transform([cleaned_input])
        prediction = model.predict(vectorized_input)

        if prediction[0] == 0:
            st.success("✅ The News is **Real**.")
        else:
            st.error("🚨 The News is **Fake**.")

st.write("Model ready for testing 🔥")
