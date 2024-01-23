from fastapi import APIRouter, HTTPException
from botocore.exceptions import ClientError
import llm.models as models
from llm.bedrock_claude import BedrockClaude
import pdfkit
from string import Template
import time
import os
import platform
import random

router = APIRouter()

if platform.system() == 'Windows':
    # Import the module specific to Windows
    import win32api
    import win32print
    path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
    config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)


pdf_template_map = {
    1: 'blue_pdf_template.png',
    2: 'green_pdf_template.png',
    3: 'red_pdf_template.png',
    4: 'yellow_pdf_template.png'}


@router.post("/chatbot_couplet_master")
def couplet_master(body: models.CocktailMaster_ChatBotRequest):
    llm = BedrockClaude()
    try:
        # print(body.prompt)
        result = llm.couplet_master(body.prompt)
        # print(result)
        return models.CocktailMaster_ChatBotResponse(
            result = result
        )
    except ClientError as e:
        if e.response["Error"]["Code"] == "AccessDeniedException":
            raise HTTPException(status_code=403)
        else:
            raise HTTPException(status_code=500)
