import chromadb
from google.genai import types


class Vector:
    """
    A class to handle vector database operations for MSME schemes using ChromaDB and Google Gemini API.
    """
    def __init__(self, genai_client, path="./msme_db"):
        self.client = chromadb.PersistentClient(path=path)
        self.genai = genai_client
        self.db = self.client.get_collection("msme_schemes")

    def query(self, query, additional_info=None):
        """Query the vector database for relevant MSME schemes based on user input.

        Args:
            query (str): User input query (MUST BE IN ENGLISH).
        Returns:
            str: Recommended schemes and follow-up questions.    
        """

        try:
            query_embedding = self.genai.models.embed_content(
                model="models/embedding-001",
                contents=query,
                config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY")
            )    

        except Exception as e:
            print(f"Embedding failed: {e}")
            return None
        
        try:
            results = self.db.query(
                query_embeddings=query_embedding.embeddings[0].values,
                n_results=3,
                include=["documents", "metadatas"]
            )
        except Exception as e:
            print(f"Query failed: {e}")
            return None
        
        if not results["documents"]:
            return "No relevant schemes found. Please try different keywords or check database content."
        
        # Prepare scheme info
        scheme_info = []
        for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
            scheme_info.append({
                "content": doc,
                "eligibility": meta.get("eligibility", "Please refer to official sites for eligibility details."),
                "description": meta.get("description", "Description not available. Please refer to official sites."),
                "application": "Includes application details" if meta.get("has_application") else "Please refer to official sites for application instructions."
            })

        scheme_details = "\n".join([
            f"• {s['content']}\n  - Eligibility: {s['eligibility']}\n  - Description: {s['description']}\n  - Application Info: {s['application']}"
            for s in scheme_info
        ])


        prompt = f"""
        You are an expert MSME scheme advisor.

        User Query: "{query}"

        You have access to relevant MSME scheme documents retrieved based on the query.

        {additional_info}

        ------------------------
        RETRIEVED SCHEME DETAILS:
        {scheme_details}
        ------------------------

        TASK:
        1. If the user is asking about **schemes relevant to their business/startup**, recommend the most suitable schemes from above.
        2. If the user is asking about a **specific scheme by name**, provide details about that scheme only if it appears in the retrieved results. Otherwise, say the scheme wasn’t found in the current knowledge base.
        3. If the query is **not about MSME schemes**, provide a general helpful response.
        4. Format recommended schemes as:

        Please dont append words like "answer:" or "response:" at the start.`

        **Recommended Schemes**
        - **[Scheme Name]**: [Brief description or benefit]
        - **Eligibility**: [...]
        - **Application**: [...]

        **Suggested Follow-up Questions**
        - [e.g., How to apply for this?]
        - [e.g., Are there similar state-level schemes?]

        Only show schemes that are a good match. If no scheme matches, suggest visiting the official MSME portal.
        """
        response = self.genai.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt]
        )
        return response.text
        

# from dotenv import load_dotenv;load_dotenv()
# from google import genai
# import os
# client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# base = Vector(client)
# print(base.query("What are the schemes for women entreprenuers in India?"))