import os
import re
import time

import chromadb
import google.generativeai as gen
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pdfminer.high_level import extract_text

# Load environment variables
load_dotenv()

# Configure Gemini
gen.configure(api_key=os.getenv("GEMINI_API_KEY"))

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# Rate limiter
def rate_limited(max_per_minute):
    interval = 60 / max_per_minute
    last_called = 0

    def decorator(func):
        def wrapper(*args, **kwargs):
            nonlocal last_called
            elapsed = time.time() - last_called
            wait = interval - elapsed
            if wait > 0:
                time.sleep(wait)
            last_called = time.time()
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Enhanced Summary Generation
@rate_limited(60)
def generate_scheme_summary(chunk):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
    Generate a 2-line summary of this MSME scheme for metadata:
    {chunk[:3000]}
    
    Required format: "Provides [benefits] for [eligible entities] in [sector]"
    Return only the summary text, no formatting.
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip('*"').strip()
    except Exception as e:
        print(f"Summary generation failed: {e}")
        return "Scheme summary unavailable"

# Improved Text Processing
def split_and_trim(text):
    chunks = re.split(r'\nScheme:\s*|\n##\s*', text)
    processed_chunks = []
    
    for chunk in chunks:
        # Size control
        chunk = chunk[:30000] if len(chunk.encode('utf-8')) > 35000 else chunk
        
        # Extract eligibility and description (placeholder logic)
        eligibility = "Eligibility details not available"  # Replace with actual extraction logic
        description = "Description not available"  # Replace with actual extraction logic
        
        contains_application = "How to Apply" in chunk
        
        processed_chunks.append({
            "content": chunk,
            "metadata": {
                "eligibility": eligibility,
                "description": description,
                "has_application": contains_application,
                "keywords": list(set(re.findall(r'\b\w{4,}\b', chunk.lower())))
            }
        })
    
    return processed_chunks

# Document Loader with Validation
def load_msme_documents(folder_path):
    documents = []
    metadatas = []
    
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".pdf"):
            file_path = os.path.join(folder_path, file_name)
            try:
                text = extract_text(file_path)
                chunks = split_and_trim(text)
                
                for chunk in chunks:
                    documents.append(chunk["content"])
                    metadatas.append(chunk["metadata"])
            except Exception as e:
                print(f"Error processing {file_name}: {e}")
    
    return documents, metadatas

# Database Initialization with Validation
def create_scheme_database(documents, metadatas):
    client = chromadb.PersistentClient(path="./msme_db")
    collection = client.get_or_create_collection("msme_schemes")
    
    embeddings = []
    for doc in documents:
        try:
            embedding = genai.embed_content(
                model="models/embedding-001",
                content=doc,
                task_type="retrieval_document"
            )["embedding"]
            embeddings.append(embedding)
        except Exception as e:
            print(f"Embedding failed: {e}")
            continue
    
    # Batch insert with metadata
    batch_size = 5
    valid_ids = []
    valid_docs = []
    valid_embeds = []
    valid_metas = []
    
    for i in range(0, len(documents)):
        if i < len(embeddings):  # Skip failed embeddings
            valid_ids.append(str(i))
            valid_docs.append(documents[i])
            valid_embeds.append(embeddings[i])
            valid_metas.append(metadatas[i])
    
    # Upsert valid entries
    for i in range(0, len(valid_docs), batch_size):
        collection.upsert(
            ids=valid_ids[i:i+batch_size],
            documents=valid_docs[i:i+batch_size],
            embeddings=valid_embeds[i:i+batch_size],
            metadatas=valid_metas[i:i+batch_size]
        )
    
    return collection


# Enhanced Query Handling
def get_scheme_recommendations(query, collection):
    """Generate recommendations with fallback text for missing details"""
    # Embed query
    try:
        # query_embedding = genai.embed_content(
        #     model="models/embedding-001",
        #     content=query,
        #     task_type="retrieval_query"
        # )["embedding"]

        query_embedding = client.models.embed_content(
            model="models/embedding-001",
            contents=query,
            config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY")
        )
        print(len(query_embedding.embeddings))

    except Exception as e:
        return f"Query embedding failed: {str(e)}"

    # Retrieve results with metadata
    try:
        results = collection.query(
            query_embeddings=[query_embedding.embeddings[0].values],
            n_results=3,
            include=["documents", "metadatas"]
        )
    except Exception as e:
        return f"Database query failed: {str(e)}"

    # Validate results
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

    # Generate response
    # model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
You are an expert MSME scheme advisor.

User Query: "{query}"

You have access to relevant MSME scheme documents retrieved based on the query.

------------------------
RETRIEVED SCHEME DETAILS:
{chr(10).join([
    f"• {s['content']}\n  - Eligibility: {s['eligibility']}\n  - Description: {s['description']}\n  - Application Info: {s['application']}"
    for s in scheme_info
])}
------------------------

TASK:
1. If the user is asking about **schemes relevant to their business/startup**, recommend the most suitable schemes from above.
2. If the user is asking about a **specific scheme by name**, provide details about that scheme only if it appears in the retrieved results. Otherwise, say the scheme wasn’t found in the current knowledge base.
3. If the query is **not about MSME schemes**, provide a general helpful response.
4. Format recommended schemes as:

**Recommended Schemes**
- **[Scheme Name]**: [Brief description or benefit]
  - **Eligibility**: [...]
  - **Application**: [...]

**Suggested Follow-up Questions**
- [e.g., How to apply for this?]
- [e.g., Are there similar state-level schemes?]

Only show schemes that are a good match. If no scheme matches, suggest visiting the official MSME portal.
"""


    try:
        # response = model.generate_content(prompt)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt]
        )
        return response.text
    except Exception as e:
        return f"Response generation failed: {str(e)}"


# Main Application Flow
def main():
    print("\n🔍 MSME Scheme Recommendation Assistant")
    
    # Initialize database
    if not os.path.exists("./msme_db"):
        print("Building knowledge base...")
        docs, metas = load_msme_documents("./msme-docs")
        if not docs:
            print("No valid documents found. Check PDF files and try again.")
            return
        db = create_scheme_database(docs, metas)
    else:
        client = chromadb.PersistentClient(path="./msme_db")
        db = client.get_collection("msme_schemes")
    
    # Interactive session
    print("Type 'exit' to quit\n")
    while True:
        try:
            query = input("Describe your business needs: ")
            if query.lower() == 'exit':
                break
                
            response = get_scheme_recommendations(query, db)
            print("\n" + response + "\n")
            
        except KeyboardInterrupt:
            print("\nExiting... Thank you!")
            break

if __name__ == "__main__":
    main()
