import requests


class NMT():
    def __init__(self,api_key:str, app_id:str):
        self.api_key = api_key
        self.app_id = app_id
        self.url = "https://revapi.reverieinc.com/"


    def generate_headers(self, src_lang, tgt_lang, app_name="localization", app_version="3.0"):
        headers = {
            "Content-Type": "application/json",
            "REV-API-KEY": self.api_key,
            "REV-APP-ID": self.app_id,
            "src_lang": src_lang,
            "tgt_lang": tgt_lang,
            "domain": "generic",
            "REV-APPNAME": app_name,
            "REV-APPVERSION": app_version
        }

        return headers
    
    def translate(self, text:str, src_lang:str, tgt_lang:str):
        headers = self.generate_headers(src_lang, tgt_lang)
        payload = {
            "data": [text],
            "enableNmt": True,
            "enableLookup": True
        }
        response = requests.post(self.url, headers=headers, json=payload)
        if response.status_code == 200:
            return response.json()['responseList'][0]["outString"]
        else:
            raise Exception(f"Error: {response.status_code} - {response.text}")
        