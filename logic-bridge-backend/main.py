from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict

app = FastAPI()

# This middleware tells the server to accept cross-origin requests from the Figma UI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FigmaComponent(BaseModel):
    component_name: str
    states: Dict[str, str]

@app.post("/generate-flutter")
async def generate_flutter_code(data: FigmaComponent):
    print(f"✅ Received data for: {data.component_name}")
    
    # We generate the Dart boilerplate dynamically based on the states we receive
    dart_code = f"""
class {data.component_name}Controller extends StatelessWidget {{
  final AppState state;
  const {data.component_name}Controller({{Key? key, required this.state}}) : super(key: key);

  @override
  Widget build(BuildContext context) {{
"""
    if "isLoading" in data.states:
        dart_code += f"    if (state.isLoading) return const {data.states['isLoading']}();\n"
    if "hasError" in data.states:
        dart_code += f"    if (state.hasError) return const {data.states['hasError']}();\n"
    if "isEmpty" in data.states:
        dart_code += f"    if (state.isEmpty) return const {data.states['isEmpty']}();\n"
        
    dart_code += f"    return const {data.states.get('isSuccess', data.component_name + 'Main')}();\n  }}\n}}"

    return {
        "status": "success",
        "component": data.component_name,
        "flutter_code": dart_code
    }