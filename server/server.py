from fastapi import FastAPI, UploadFile
from fastapi.responses import StreamingResponse 
import kmeans

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/cluster_count_analysis/")
async def create_upload_file(file: UploadFile):

    df = kmeans.make_df(file)

    buf = kmeans.cluster_count_analysis(df)
    return StreamingResponse(buf, media_type="image/png")