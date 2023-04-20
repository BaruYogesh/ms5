from fastapi import FastAPI, UploadFile, Depends, HTTPException, Depends
from fastapi.responses import StreamingResponse, Response, FileResponse
from pydantic import BaseModel as PydanticBaseModel

import kmeans

from fastapi_sessions.backends.implementations import InMemoryBackend
from fastapi_sessions.session_verifier import SessionVerifier
from fastapi_sessions.frontends.implementations import SessionCookie, CookieParameters
from uuid import uuid4, UUID

from fastapi.middleware.cors import CORSMiddleware

from pandas import DataFrame

origins = [
    "*"
]

class BaseModel(PydanticBaseModel):
    class Config:
        arbitrary_types_allowed = True
class SessionData(BaseModel):
    df: DataFrame

cookie_params = CookieParameters()

# Uses UUID
cookie = SessionCookie(
    cookie_name="cookie",
    identifier="general_verifier",
    auto_error=True,
    secret_key="DONOTUSE",
    cookie_params=cookie_params,
)
backend = InMemoryBackend[UUID, SessionData]()

class BasicVerifier(SessionVerifier[UUID, SessionData]):
    def __init__(
        self,
        *,
        identifier: str,
        auto_error: bool,
        backend: InMemoryBackend[UUID, SessionData],
        auth_http_exception: HTTPException,
    ):
        self._identifier = identifier
        self._auto_error = auto_error
        self._backend = backend
        self._auth_http_exception = auth_http_exception

    @property
    def identifier(self):
        return self._identifier

    @property
    def backend(self):
        return self._backend

    @property
    def auto_error(self):
        return self._auto_error

    @property
    def auth_http_exception(self):
        return self._auth_http_exception

    def verify_session(self, model: SessionData) -> bool:
        """If the session exists, it is valid"""
        return True

verifier = BasicVerifier(
    identifier="general_verifier",
    auto_error=True,
    backend=backend,
    auth_http_exception=HTTPException(status_code=403, detail="invalid session"),
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/whoami", dependencies=[Depends(cookie)])
async def whoami(session_data: SessionData = Depends(verifier)):
    return session_data


@app.post("/delete_session")
async def del_session(response: Response, session_id: UUID = Depends(cookie)):
    await backend.delete(session_id)
    cookie.delete_from_response(response)
    return "deleted session"

@app.get("/")
async def root():
    return {"message": "Hello World"}

# @app.get('/create_df')
# async def create_df()

@app.post("/cluster_count_analysis/")
async def create_upload_file(file: UploadFile):

    df = kmeans.make_df(file)
    session = uuid4()
    buf = kmeans.cluster_count_analysis(df, str(session))

    data = SessionData(df=df)

    await backend.create(session, data)
    resp = StreamingResponse(buf, media_type="image/png")
    cookie.attach_to_response(resp, session)

    return resp

@app.post("/monthly_dist/", dependencies=[Depends(cookie)])
async def monthly_dist(clusters: int, session_data: SessionData = Depends(verifier)):
    df = session_data

    monthly_dist(clusters=14, df=session_data)


@app.post("/return_wordcount/")
async def create_wordcount_file(file: UploadFile):
    df = kmeans.make_df(file)

    buf = kmeans.monthly_dist(2, df)

    session = uuid4()
    data = SessionData(df=df)

    await backend.create(session, data)
    resp = StreamingResponse(buf, media_type="image/png")
    cookie.attach_to_response(resp, session)

    return resp

