import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import {
  render,
  Container,
  Text,
  VerticalSpace,
  Button,
  Dropdown,
} from "@create-figma-plugin/ui";
import "!./styles.css";

function PluginUI() {
  const [logicState, setLogicState] = useState<string>("isSuccess");

  const stateOptions = [
    { value: "isSuccess", text: "Success (Main UI)" },
    { value: "isLoading", text: "Loading (Skeleton)" },
    { value: "hasError", text: "Error (Failed State)" },
    { value: "isEmpty", text: "Empty (No Data)" },
  ];

  // 1. Listen for the "SEND_SELECTED_NAME" message from main.ts
  useEffect(() => {
    window.onmessage = async (event) => {
      const msg = event.data.pluginMessage;

      if (msg.type === "SEND_SELECTED_NAME") {
        const realNodeName = msg.nodeName;

        try {
          // 2. Send the real name to the Python AI Backend
          const response = await fetch("http://127.0.0.1:8000/predict-states", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ node_names: [realNodeName] }),
          });

          const data = await response.json();
          const suggestedState = data.predictions[realNodeName];

          // 3. Update the UI state based on AI suggestion
          setLogicState(suggestedState);
          alert(
            `🤖 AI analyzed "${realNodeName}" and suggests: ${suggestedState}`,
          );
        } catch (error) {
          console.error("AI Error:", error);
          alert(
            "Could not reach the AI Backend. Is your Python server running?",
          );
        }
      }
    };
  }, []);

  const handleTagComponent = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "TAG_COMPONENT",
          selectedLogicState: logicState,
        },
      },
      "*",
    );
  };

  const handleAISuggest = () => {
    // Request the real selection name from the Figma main thread
    parent.postMessage({ pluginMessage: { type: "GET_SELECTED_NAME" } }, "*");
  };

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Text muted>
        Select a frame, then use AI to suggest its logic state or choose
        manually.
      </Text>
      <VerticalSpace space="large" />

      <Dropdown
        onChange={(event) => setLogicState(event.currentTarget.value)}
        options={stateOptions}
        value={logicState}
      />

      <VerticalSpace space="extraLarge" />

      <Button fullWidth onClick={handleTagComponent}>
        Tag Selected Frame
      </Button>

      <VerticalSpace space="small" />

      <Button
        fullWidth
        secondary
        onClick={handleAISuggest}
        style={{ color: "#8b5cf6", borderColor: "#8b5cf6" }}
      >
        ✨ AI Suggest State
      </Button>

      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(PluginUI);
