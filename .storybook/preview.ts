import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      defaultName: "Documentation",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
