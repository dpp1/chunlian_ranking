from pydantic import BaseModel

class CocktailMaster_ChatBotRequest(BaseModel):
    prompt: str

class CocktailMaster_ChatBotResponse(BaseModel):
    result: str

class CocktailMaster_PrintRequest(BaseModel):
    text: str