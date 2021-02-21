import matplotlib.pyplot as pPlot
from wordcloud import WordCloud, STOPWORDS
import numpy as npy
from PIL import Image
import re

dataset = open("BBB.txt", "r").read()

def create_word_cloud(string):
   maskArray = npy.array(Image.open("tt.jpg"))
   cloud = WordCloud(background_color = "white", max_words = 200, mask = maskArray, stopwords = set(STOPWORDS))
   cloud.generate(string)
   cloud.to_file("wordCloud.png")

dataset = dataset.lower()
create_word_cloud(dataset)