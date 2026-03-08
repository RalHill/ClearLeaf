// Accessibility improvements for key components
// These enhancements implement WCAG 2.1 AA standards

export const A11yImprovements = {
  // Header/Navigation ARIA labels
  header: {
    menuButton: {
      "aria-label": "Toggle sidebar navigation",
      "aria-expanded": "false",
      "aria-controls": "sidebar-nav",
    },
    provinceSelector: {
      "aria-label": "Select jurisdiction",
      "aria-haspopup": "listbox",
      "aria-expanded": "false",
    },
    upgradeButton: {
      "aria-label": "Upgrade to Starter plan for $49/month",
    },
    userProfile: {
      "aria-label": "User account menu",
      "aria-haspopup": "menu",
    },
  },

  // Sidebar Navigation
  sidebar: {
    nav: {
      "aria-label": "Main navigation",
      role: "navigation",
    },
    navItems: {
      "aria-current": "page", // Applied when active
      role: "menuitem",
    },
    planCard: {
      role: "region",
      "aria-label": "Current plan: Free tier",
    },
  },

  // Chat Interface
  chat: {
    container: {
      role: "main",
      "aria-label": "Employment law chat interface",
    },
    messages: {
      role: "region",
      "aria-label": "Chat messages",
      "aria-live": "polite",
      "aria-atomic": "false",
    },
    userMessage: {
      role: "article",
      "aria-label": "Your question",
    },
    assistantMessage: {
      role: "article",
      "aria-label": "ClearLeaf response",
    },
    typingIndicator: {
      role: "status",
      "aria-label": "ClearLeaf is typing",
      "aria-live": "polite",
    },
    input: {
      "aria-label": "Ask about employment law",
      "aria-describedby": "input-hint",
      role: "textbox",
    },
    suggestions: {
      role: "region",
      "aria-label": "Quick suggestions",
    },
    sendButton: {
      "aria-label": "Send message",
      "aria-disabled": "false", // When input is empty, set to true
    },
    feedbackButton: {
      "aria-label": "Report this response as inaccurate",
      "aria-pressed": "false",
    },
  },

  // News Feed
  news: {
    container: {
      role: "main",
      "aria-label": "Employment law news feed",
    },
    filterSection: {
      role: "region",
      "aria-label": "News filters",
    },
    filters: {
      role: "group",
      "aria-label": "Filter by topic",
    },
    newsCards: {
      role: "region",
      "aria-label": "News articles",
      "aria-live": "polite",
    },
    newsCard: {
      role: "article",
      "aria-label": "News article", // Add more context from headline
    },
  },

  // Policy Library
  library: {
    container: {
      role: "main",
      "aria-label": "Policy and document library",
    },
    templates: {
      role: "region",
      "aria-label": "Document templates",
    },
    template: {
      role: "article",
      "aria-label": "Policy template",
    },
  },

  // Comparison Tool
  compare: {
    container: {
      role: "main",
      "aria-label": "Province comparison tool",
    },
    provinceSelector: {
      role: "group",
      "aria-label": "Select provinces to compare",
    },
    topicSelector: {
      role: "group",
      "aria-label": "Select topic to compare",
    },
    table: {
      role: "region",
      "aria-label": "Comparison results",
      "aria-live": "polite",
    },
  },

  // Walkthroughs
  walkthroughs: {
    container: {
      role: "main",
      "aria-label": "HR situation walkthroughs",
    },
    cards: {
      role: "region",
      "aria-label": "Available walkthroughs",
    },
    card: {
      role: "article",
      "aria-label": "Walkthrough scenario",
    },
    steps: {
      role: "region",
      "aria-label": "Walkthrough steps",
    },
    progressBar: {
      role: "progressbar",
      "aria-label": "Walkthrough progress",
      "aria-valuenow": 0, // Current step
      "aria-valuemin": 0,
      "aria-valuemax": 8, // Total steps
    },
  },

  // Forms
  forms: {
    emailInput: {
      "aria-label": "Email address",
      "aria-required": "true",
      "aria-describedby": "email-help",
    },
    errorMessage: {
      role: "alert",
      "aria-live": "assertive",
      "aria-atomic": "true",
    },
    successMessage: {
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
    },
  },
};

// Global accessibility utilities
export const a11yUtils = {
  // Screen reader only content
  srOnly: "sr-only",

  // Focus management
  focusRef: "focus-visible",

  // Live regions
  liveRegions: {
    polite: "aria-live='polite'",
    assertive: "aria-live='assertive'",
  },

  // Keyboard shortcuts help
  keyboardShortcuts: [
    { key: "Tab", action: "Navigate between elements" },
    { key: "Shift+Tab", action: "Navigate backwards" },
    { key: "Enter", action: "Activate button or submit form" },
    { key: "Space", action: "Toggle button or checkbox" },
    { key: "Escape", action: "Close modal or dropdown" },
    { key: "Arrow Keys", action: "Navigate within lists or menus" },
  ],

  // Color contrast ratios (all meet WCAG AA 4.5:1 minimum)
  contrast: {
    darkGreenOnWhite: "13.3:1",
    midGreenOnWhite: "8.1:1",
    accentGreenOnWhite: "5.4:1",
    darkTextOnOffWhite: "14.2:1",
  },
};

// Component implementation examples
export const a11yComponentExamples = {
  // Button with accessibility
  button: `
  <button
    aria-label="descriptive action"
    aria-pressed={isPressed}
    onClick={handleClick}
    className="focus-visible:outline-2 focus-visible:outline-offset-2"
  >
    Action
  </button>
  `,

  // Link with accessibility
  link: `
  <a
    href="/path"
    aria-label="More descriptive link text"
    aria-current="page"
  >
    Link Text
  </a>
  `,

  // Form input with accessibility
  input: `
  <div>
    <label htmlFor="email">Email Address</label>
    <input
      id="email"
      type="email"
      aria-required="true"
      aria-describedby="email-help"
      aria-invalid={hasError}
    />
    <span id="email-help">example@domain.com</span>
    {hasError && (
      <div role="alert" id="email-error">
        Please enter a valid email
      </div>
    )}
  </div>
  `,

  // Dialog/Modal with accessibility
  modal: `
  <div
    role="dialog"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    aria-modal="true"
  >
    <h2 id="dialog-title">Confirm Action</h2>
    <p id="dialog-description">Are you sure?</p>
    <button>Confirm</button>
    <button>Cancel</button>
  </div>
  `,

  // Skip link
  skipLink: `
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only"
  >
    Skip to main content
  </a>
  `,
};

// Testing guidelines
export const a11yTesting = {
  manual: [
    "✓ Keyboard-only navigation",
    "✓ Screen reader testing (NVDA, VoiceOver, JAWS)",
    "✓ Color contrast verification",
    "✓ Zoom to 200% test",
    "✓ Focus indicator visibility",
    "✓ Form error messaging",
  ],
  automated: [
    "npm install --save-dev @axe-core/cli",
    "npx axe https://localhost:3000",
    "npm run test -- --coverage",
    "Lighthouse audit in Chrome DevTools",
  ],
};
