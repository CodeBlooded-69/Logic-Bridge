import { showUI } from "@create-figma-plugin/utilities";

export default function () {
  // 1. Show the UI sidebar with a specific size
  showUI({ height: 240, width: 320 });

  // 2. Listen for messages coming from the UI (ui.tsx)
  figma.ui.onmessage = (msg) => {
    // Check if the message is the one we defined in our UI button
    if (msg.type === "TAG_COMPONENT") {
      const selection = figma.currentPage.selection;

      // 3. Validation: Make sure the designer actually selected something
      if (selection.length === 0) {
        figma.notify("⚠️ Please select a frame or component first.", {
          error: true,
        });
        return;
      }

      // 4. Get the first selected item
      const selectedNode = selection[0];
      const stateToTag = msg.selectedLogicState;

      // 5. The Magic: Save this data invisibly into the Figma file
      // setPluginData stores custom metadata on the node that our Python server will read later
      selectedNode.setPluginData("logic-state", stateToTag);

      // 6. Give the designer visual feedback
      figma.notify(
        `✅ Successfully tagged "${selectedNode.name}" as ${stateToTag}`,
      );
    }
  };
}
