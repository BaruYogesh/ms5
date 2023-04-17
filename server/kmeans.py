import numpy as np
import pandas as pd
import sklearn
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
import matplotlib.pyplot as plt
import io
from fastapi import UploadFile
from sklearn.decomposition import LatentDirichletAllocation


def make_df(file: UploadFile) -> pd.DataFrame:

    df = pd.read_excel(io.BytesIO(file.file.read()), engine='openpyxl', sheet_name=None)
    df = pd.concat(df, ignore_index=True) # combines all of the worksheets into the same dataframe

    return df

def cluster_count_analysis(df: pd.DataFrame):

    featureset = []
    for point in range(len(df)):
        featureset.append(str(df['Feature Title'][point]) + ' : '+ str(df['Feature Description'][point]))


    cv = sklearn.feature_extraction.text.TfidfVectorizer(max_df=.4, min_df=.1)
    data = cv.fit_transform(featureset).toarray()

    sse = []
    MAX_CLUSTERS = 50

    for k in range(2,MAX_CLUSTERS, 2): # Test inertia values for different clutser counts
        model = sklearn.cluster.KMeans(n_clusters=k, max_iter=100, n_init=10)
        model.fit(data)
        sse.append(model.inertia_)

    plt.plot(range(2, MAX_CLUSTERS, 2), sse)
    plt.xticks(range(2, MAX_CLUSTERS, 2))
    plt.xlabel("Number of Clusters")
    plt.ylabel("SSE")

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)

    return buf

def monthly_dist(num_clusters, df):

    MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] # Months for display
    for cluster in range(num_clusters):
        month_data = [0 for element in range(12)] # Initialize array of 0s to count distribution of months
        LDA_Featureset = []
        for point in range(len(df)):
            if(df["Cluster"][point] == cluster): # Lazy way of grabbing specific clusters 
                LDA_Featureset.append(str(df['Feature Title'][point]) + ' : '+ str(df['Feature Description'][point])) # Get information for LDA per cluster
                py_month = pd.Timestamp(df["Release Date"][point]).month - 1 # pandas has timestamp to extract month as int easily
                if(isinstance(py_month, int)): # Any row that doesn't have month data should be excluded
                    month_data[py_month] += 1
    
    print(f'Cluster: {cluster}')
    plt.bar(MONTHS, month_data)
    plt.show()

    # Get the most common words in the clusters
    cv = sklearn.feature_extraction.text.TfidfVectorizer(max_df=.4, min_df=.1)
    lda_data = cv.fit_transform(LDA_Featureset).toarray()

    lda = LatentDirichletAllocation(n_components = 2, doc_topic_prior=1)
    lda.fit(lda_data)

    vocab = cv.get_feature_names_out()
    topic_words = {}
    n_top_words = 5
    for topic, comp in enumerate(lda.components_):
        word_idx = np.argsort(comp)[::-1][:n_top_words]
        topic_words[topic] = [vocab[i] for i in word_idx]

    for topic, words in topic_words.items():
        print(f'Top words for topic {topic}')
        print(' %s' % ', '.join(words))
    print('\n')