import matplotlib.pyplot as pPlot
from wordcloud import WordCloud, STOPWORDS
import numpy as npy
from PIL import Image
from flask import Flask
import os
import re
from m_stopwords import pt_stopwords

app = Flask(__name__)


stopwords = set(STOPWORDS)
stopwords.update(pt_stopwords)

def create_word_cloud(string):
   maskArray = npy.array(Image.open("tt.png"))
   cloud = WordCloud(background_color = "white", max_words = 2000, mask = maskArray, stopwords = stopwords, width = 9000, height = 9000)
   cloud.generate(string)
   cloud.to_file("wordCloud.png")

@app.route('/createCloud')
def createCloud():
   dataset = open("./../tweet-streamer/BBB.txt", "r").read()
   dataset = dataset.lower()
   create_word_cloud(dataset)
   return "200"


app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000))