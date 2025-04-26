import pandas as pd
import numpy as np
import re
import nltk
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
nltk.download('stopwords')
from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = re.sub(r'[^a-zA-Z]', ' ', str(text))
    text = text.lower().split()
    text = [word for word in text if word not in stop_words]
    return ' '.join(text)

print("✅ Loading Datasets...")
fake = pd.read_csv('data/fake.csv')
true = pd.read_csv('data/true.csv')

fake['label'] = 1  # 1 - Fake
true['label'] = 0  # 0 - Real

data = pd.concat([fake, true], axis=0).reset_index(drop=True)
data['text'] = data['title'] + " " + data['text']
data.drop(['title', 'subject', 'date'], axis=1, inplace=True, errors='ignore')

print("✅ Cleaning Text...")
data['text'] = data['text'].apply(clean_text)

print("✅ Vectorizing Text...")
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(data['text']).toarray()
y = data['label'].values

print("✅ Balancing Dataset with SMOTE...")
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

print("✅ Splitting Data...")
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

print("✅ Training Model...")
model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"\n✅ Accuracy: {accuracy_score(y_test, y_pred)}")
print("\n✅ Classification Report:\n", classification_report(y_test, y_pred))
print("\n✅ Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

pickle.dump(model, open('models/fake_news_model.pkl', 'wb'))
pickle.dump(vectorizer, open('models/vectorizer.pkl', 'wb'))
print("\n✅ Model and Vectorizer Saved Successfully!")
