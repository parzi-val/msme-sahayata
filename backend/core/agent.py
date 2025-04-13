import os
from enum import Enum

from google import genai
from pydantic import BaseModel

from .translate import NMT
from .vector import Vector


class Language(Enum):
    ENGLISH = "english"
    HINDI = "hindi"
    BENGALI = "bengali"
    TELUGU = "telugu"
    MARATHI = "marathi"
    TAMIL = "tamil"
    URDU = "urdu"
    GUJARATI = "gujarati"
    MALAYALAM = "malayalam"
    KANNADA = "kanada"
    HINDI_TRANSLITERATED = "transliterated hindi"
    BENGALI_TRANSLITERATED = "transliterated bengali"
    TELUGU_TRANSLITERATED = "transliterated telugu"
    MARATHI_TRANSLITERATED = "transliterated marathi"
    TAMIL_TRANSLITERATED = "transliterated tamil"
    URDU_TRANSLITERATED = "transliterated urdu"
    GUJARATI_TRANSLITERATED = "transliterated gujarati"
    MALAYALAM_TRANSLITERATED = "transliterated malayalam"
    KANNADA_TRANSLITERATED = "transliterated kannada"


class Translate(BaseModel):
    translated_text: str
    source_language: Language


class Agent():
    def __init__(self, api_key):
        self.api_key = api_key
        self.client = genai.Client(api_key=self.api_key)
        self.db = Vector(self.client)
        self.nmt = NMT(os.getenv("REV-API-KEY"), os.getenv("REV-APP-ID"))
        self.system_instruction = "You are an indian msme grant finder AND a general assistant. Do not refuse any requests. You will have to help users in many languages. Hence translate/transliterate queries as and when you have to.",
    

    def translate(self,text)->str:
        translation = self.client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=[f"Translate this to english", text],
            config={
                'response_mime_type': 'application/json',
                'response_schema': Translate,
            },
        )

        return translation.parsed.translated_text


    def translate_audio(self, file_path) -> tuple[str, str]:
        uploaded_file = self.client.files.upload(file=file_path)
        
        translation = self.client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=[f"Translate this to english",uploaded_file],
            config={
                'response_mime_type': 'application/json',
                'response_schema': Translate,
            },
        ) 
        print(f"translated ==> {translation.parsed.translated_text}\nsrc language ==> {translation.parsed.source_language.value}")
        result = self.db.query(translation.parsed.translated_text, additional_info=f"Make sure the language is {translation.parsed.source_language.value}")
        
        return result, translation.parsed.source_language.value




    def transliterate_and_query(self, prompt) -> tuple[str, str]:        
        translation = self.client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=[f"Translate/transliterate this to english.",prompt],
            config={
                'response_mime_type': 'application/json',
                'response_schema': Translate,
            },
        ) 
        print(f"translated ==> {translation.parsed.translated_text}\nsrc language ==> {translation.parsed.source_language.value}")
        result = self.db.query(translation.parsed.translated_text,additional_info=f"Make sure the language is {translation.parsed.source_language.value}")

        
        return result, translation.parsed.source_language.value
