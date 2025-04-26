import pickle
import re
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = re.sub(r'[^a-zA-Z]', ' ', str(text))
    text = text.lower().split()
    text = [word for word in text if word not in stop_words]
    return ' '.join(text)

model = pickle.load(open('models/fake_news_model.pkl', 'rb'))
vectorizer = pickle.load(open('models/vectorizer.pkl', 'rb'))

news = input("📰 Paste the news you want to check: \n")

cleaned = clean_text(news)
vectorized = vectorizer.transform([cleaned])
prediction = model.predict(vectorized)[0]

if prediction == 0:
    print("\n✅ REAL NEWS ✅")
else:
    print("\n🚨 FAKE NEWS 🚨")
