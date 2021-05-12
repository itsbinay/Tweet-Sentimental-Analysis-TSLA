from flask import Flask, request
import json
from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer
import re

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def test():
    text = request.data
    text = text.decode('utf8')[1:-1]
    blob = TextBlob(str(text), analyzer=NaiveBayesAnalyzer())
    sentiment = blob.sentiment
    result = 0
    if sentiment.p_pos > sentiment.p_neg:
        result = 1
    return str(result)
    
@app.route('/test', methods=['GET'])
def hello():
    return "The Model is Running"

if __name__ == "__main__":
    app.run('0.0.0.0')
