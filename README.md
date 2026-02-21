# Logic-Bridge 🌉

Logic-Bridge is a developer-productivity suite designed to bridge the gap between **Figma design** and **Flutter development**. It allows designers to "tag" UI logic states directly in Figma and enables developers to pull that logic into VS Code as clean Dart boilerplate.

## 🚀 The Workflow
1. **Figma Plugin**: Tag frames with states like `isLoading`, `isSuccess`, or `isEmpty`.
2. **Python Middleware**: A FastAPI server that processes Figma metadata and generates context-aware Flutter code.
3. **VS Code Extension**: A command-palette tool for developers to inject generated logic directly into their IDE.



## 🛠 Tech Stack
- **Frontend**: Preact (Figma Plugin UI)
- **Backend**: Python (FastAPI, Uvicorn)
- **Editor Tooling**: TypeScript (VS Code Extension API)
- **Target Language**: Dart (Flutter)

## 📦 Project Structure
- `/logic-bridge-figma`: The Figma plugin source code.
- `/logic-bridge-backend`: The FastAPI server for code generation.
- `/logic-bridge-vscode`: The VS Code extension source code.
- 
