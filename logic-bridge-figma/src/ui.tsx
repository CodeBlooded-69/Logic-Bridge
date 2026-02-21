import { h } from "preact";
import { useState } from "preact/hooks";
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

  // NEW: The function that talks to your Python backend
  const handleTestExport = async () => {
    try {
      // We are sending a mock JSON payload of a tagged CampusConnect component
      const payload = {
        component_name: "LostItemCard",
        states: {
          isLoading: "ItemSkeletonLoader",
          isEmpty: "NoItemsFoundState",
          isSuccess: "ItemDetailsMain",
        },
      };

      const response = await fetch("http://127.0.0.1:8000/generate-flutter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Log the generated Dart code to the console and alert the user
      console.log("🔥 Auto-Generated Dart Code:\\n", data.flutter_code);
      alert(
        "Success! Check the Figma Developer Console for the generated Flutter code.",
      );
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to the Python server. Is Uvicorn running?");
    }
  };

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Text>Select a frame, choose its logic state, and tag it.</Text>
      <VerticalSpace space="large" />

      <Dropdown
        onChange={(event) => setLogicState(event.currentTarget.value)}
        options={stateOptions}
        value={logicState}
      />
      <VerticalSpace space="large" />

      <Button fullWidth onClick={handleTagComponent}>
        Tag Selected Frame
      </Button>
      <VerticalSpace space="medium" />

      {/* NEW: The button to test the API connection */}
      <Button fullWidth secondary onClick={handleTestExport}>
        Test Code Generation
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(PluginUI);
