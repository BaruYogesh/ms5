import numpy as np
import pandas as pd
import sklearn
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
import matplotlib.pyplot as plt
import io
from fastapi import UploadFile

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