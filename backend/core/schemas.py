from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=2)
    k: int = Field(default=20, ge=1, le=50)


class CheckRequest(BaseModel):
    drugs: list[str] = Field(default_factory=list)


class AskRequest(BaseModel):
    question: str = Field(..., min_length=3)


class SearchHit(BaseModel):
    drugbank_id: str
    name: str
    score: float
    indication: str | None = None
    mechanism: str | None = None
