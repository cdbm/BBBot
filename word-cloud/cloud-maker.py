import matplotlib.pyplot as pPlot
from wordcloud import WordCloud, STOPWORDS
import numpy as npy
from PIL import Image
import re
from m_stopwords import pt_stopwords

dataset = open("BBB.txt", "r").read()
stopwords = set(STOPWORDS)
stopwords.update(pt_stopwords)
def create_word_cloud(string):
   maskArray = npy.array(Image.open("tt.jpg"))
   cloud = WordCloud(background_color = "white", max_words = 200, mask = maskArray, stopwords = stopwords)
   cloud.generate(string)
   cloud.to_file("wordCloud.png")

dataset = dataset.lower()
create_word_cloud(dataset)