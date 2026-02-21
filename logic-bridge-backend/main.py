from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
import re

app = FastAPI()

# Enable CORS so your Figma plugin and VS Code can talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Logic Patterns for state prediction
LOGIC_PATTERNS = {
    "isLoading": r"(loading|skeleton|shimmer|wait|process)",
    "hasError": r"(error|failed|warning|alert|wrong)",
    "isEmpty": r"(empty|no_data|blank|not_found)",
    "isSuccess": r"(success|main|content|active|loaded)"
}

def predict_logic_state(node_name: str) -> str:
    name_lower = node_name.lower()
    for state, pattern in LOGIC_PATTERNS.items():
        if re.search(pattern, name_lower):
            return state
    return "isSuccess"

class PredictionRequest(BaseModel):
    node_names: List[str]

@app.get("/")
async def root():
    return {"message": "Logic-Bridge AI Backend is Running"}

@app.post("/predict-states")
async def predict_states(data: PredictionRequest):
    predictions = {name: predict_logic_state(name) for name in data.node_names}
    return {"status": "success", "predictions": predictions}

@app.post("/generate-flutter")
async def generate_flutter(data: dict):
    # This is the endpoint your VS Code extension calls
    comp_name = data.get("component_name", "MyComponent")
    
    flutter_code = f"""
class {comp_name}Controller extends StatelessWidget {{
  final bool isLoading;
  
  const {comp_name}Controller({{super.key, required this.isLoading}});

  @override
  Widget build(BuildContext context) {{
    if (isLoading) return const {comp_name}Skeleton();
    return const {comp_name}Main();
  }}
}}
"""
    return {"flutter_code": flutter_code}