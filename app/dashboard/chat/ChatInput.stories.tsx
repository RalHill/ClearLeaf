import type { Meta, StoryObj } from "@storybook/react";

// Placeholder story until ChatInput component is created
// This demonstrates the Storybook structure

const meta = {
  title: "Components/Chat",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const ChatInterface: StoryObj = {
  render: () => (
    <div style={{ width: "500px", padding: "20px" }}>
      <h3>Chat Input</h3>
      <textarea
        placeholder="Ask about Ontario employment law..."
        style={{
          width: "100%",
          minHeight: "80px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      />
      <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button style={{ padding: "6px 12px", borderRadius: "20px", cursor: "pointer" }}>
          Termination notice
        </button>
        <button style={{ padding: "6px 12px", borderRadius: "20px", cursor: "pointer" }}>
          Harassment complaint
        </button>
        <button style={{ padding: "6px 12px", borderRadius: "20px", cursor: "pointer" }}>
          Parental leave
        </button>
      </div>
    </div>
  ),
};
