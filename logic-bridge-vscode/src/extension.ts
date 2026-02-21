import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Logic-Bridge is now active!");

  // Register the command we defined in package.json
  let disposable = vscode.commands.registerCommand(
    "logic-bridge-vscode.generateLogic",
    async () => {
      // 1. Ensure a text editor is active. If not, create a new Dart file automatically.
      let editor = vscode.window.activeTextEditor;
      if (!editor) {
        const document = await vscode.workspace.openTextDocument({
          language: "dart",
        });
        editor = await vscode.window.showTextDocument(document);
      }

      // 2. Ask for the Component Name (Defaulting to your CampusConnect project style)
      const componentName = await vscode.window.showInputBox({
        prompt: "Enter the Figma Component Name for logic generation",
        placeHolder: "e.g., LostItemCard",
        value: "LostItemCard",
      });

      if (!componentName) return;

      // 3. Start a background progress task while calling the API
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Logic-Bridge: Connecting to Python Backend...`,
          cancellable: false,
        },
        async (progress) => {
          try {
            // 4. Call your Python FastAPI server
            const payload = {
              component_name: componentName,
              states: {
                isLoading: `${componentName}Skeleton`,
                isEmpty: `${componentName}Empty`,
                isSuccess: `${componentName}Main`,
                hasError: `${componentName}Error`,
              },
            };

            const response = await fetch(
              "http://127.0.0.1:8000/generate-flutter",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              },
            );

            if (!response.ok) throw new Error("Network response was not ok");

            const data = (await response.json()) as any;

            // 5. Inject the generated Flutter code at the cursor position
            const currentEditor = vscode.window.activeTextEditor;
            if (currentEditor) {
              currentEditor.edit((editBuilder) => {
                const position = currentEditor.selection.active;
                editBuilder.insert(position, data.flutter_code);
              });
              vscode.window.showInformationMessage(
                `✅ Successfully generated logic for ${componentName}!`,
              );
            }
          } catch (error) {
            // Friendly error if the Python server (Uvicorn) isn't running
            vscode.window.showErrorMessage(
              "Connection Failed! Please ensure your Python Uvicorn server is running on http://127.0.0.1:8000",
            );
            console.error("Logic-Bridge Error:", error);
          }
        },
      );
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
