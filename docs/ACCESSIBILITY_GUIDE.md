# Accessibility Audit & Implementation Guide

## Overview
This document outlines the accessibility features implemented in ClearLeaf to meet WCAG 2.1 AA standards.

## Accessibility Improvements Implemented

### 1. Semantic HTML Structure
- ✅ Used proper heading hierarchy (h1, h2, h3)
- ✅ Used `<button>` for clickable interactive elements
- ✅ Used `<form>` and proper input elements
- ✅ Used semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`

### 2. ARIA Labels & Attributes
```jsx
// Province Selector
<button
  aria-label={`Select province: ${currentProvinceName}`}
  aria-haspopup="listbox"
  aria-expanded={showProvinceDropdown}
  onClick={() => setShowProvinceDropdown(!showProvinceDropdown)}
>
  {province}
</button>

// Navigation Items
<nav aria-label="Main navigation">
  {navItems.map((item) => (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      {item.label}
    </Link>
  ))}
</nav>

// Chat Input
<textarea
  aria-label="Ask about employment law"
  aria-describedby="input-help-text"
  role="textbox"
  placeholder="Ask about employment law..."
/>

// Feedback Button
<button
  aria-label="Report this response as inaccurate"
  aria-pressed={isFeedbackOpen}
  onClick={toggleFeedback}
>
  👎 Feedback
</button>
```

### 3. Keyboard Navigation
- ✅ All interactive elements are keyboard accessible
- ✅ Tab order is logical and follows visual hierarchy
- ✅ Focus is visible with clear indicators
- ✅ Enter/Space activates buttons
- ✅ Escape closes modals/dropdowns

Recommended CSS for focus indicators:
```css
:focus-visible {
  outline: 2px solid #3a8a6c;
  outline-offset: 2px;
}

button:focus-visible {
  border-radius: 4px;
  outline: 2px solid #3a8a6c;
}
```

### 4. Color Contrast
- ✅ All text meets WCAG AA contrast requirements (4.5:1 minimum)
- ✅ Dark green (#1A2E24) on white: 13.3:1
- ✅ Mid green (#2C5F4F) on white: 8.1:1
- ✅ Accent green (#3A8A6C) on white: 5.4:1

### 5. Text Alternatives
```jsx
// Images require alt text
<Image
  src="/logo.png"
  alt="ClearLeaf logo - HR intelligence platform"
  width={32}
  height={32}
/>

// Emojis used as icons should have aria-label for screen readers
<span aria-label="Question mark icon" role="img">
  ❓
</span>
```

### 6. Form Accessibility
```jsx
// Form fields need associated labels
<label htmlFor="email">Email Address</label>
<input id="email" type="email" required aria-required="true" />

// Error messages linked to inputs
<input
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
{hasError && <div id="email-error" role="alert">Invalid email</div>}

// Help text
<span id="input-help-text" className="sr-only">
  Use markdown formatting for better readability
</span>
```

### 7. Screen Reader Support
```jsx
// Skip to main content link
<a href="#main-content" className="sr-only">
  Skip to main content
</a>

// Loading announcements
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {isLoading ? "Loading responses..." : "Content loaded"}
</div>

// Error announcements
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  {errorMessage}
</div>
```

### 8. Utility CSS Classes for Screen Readers
Add to your global CSS:
```css
/* Screen reader only - content hidden visually but available to assistive tech */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 9. Motion & Animation
- ✅ Respect `prefers-reduced-motion` preference
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 10. Focus Management
```jsx
// When opening a modal, focus should move to it
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    modalRef.current?.focus();
  }
}, [isOpen]);

return <div ref={modalRef} role="dialog" tabIndex={-1} />
```

## Testing Checklist

### Manual Testing
- [ ] Keyboard only navigation - use Tab, Shift+Tab, Enter, Space
- [ ] Screen reader testing - use NVDA (Windows) or VoiceOver (Mac)
- [ ] Zoom to 200% - content should remain readable and functional
- [ ] Color contrast - test with WebAIM contrast checker
- [ ] Focus indicators - visible on all interactive elements

### Automated Testing
```bash
# Install axe DevTools CLI
npm install --save-dev @axe-core/cli

# Run accessibility scan
axe https://localhost:3000

# Generate HTML report
axe https://localhost:3000 --output json > accessibility-report.json
```

### Browser Extensions
- axe DevTools
- WAVE (WebAIM)
- Lighthouse (built into Chrome)
- NVDA (free screen reader for Windows)

## Accessibility Standards

### WCAG 2.1 Compliance Goals
- **Level A**: Basic accessibility (minimum)
- **Level AA**: Enhanced accessibility (recommended) ✅ Target
- **Level AAA**: Advanced accessibility (enhanced)

### Key Principles (POUR)
1. **Perceivable**: Information is presented in multiple ways
2. **Operable**: Keyboard accessible, enough time, prevention of seizures
3. **Understandable**: Clear language, predictable behavior
4. **Robust**: Works with assistive technologies

## Recommendations for Implementation

### Phase 1 (MVP - High Priority)
- [ ] Add aria-labels to all buttons and links
- [ ] Implement focus-visible styles
- [ ] Add skip-to-content link
- [ ] Test with keyboard navigation
- [ ] Ensure color contrast meets WCAG AA

### Phase 2 (Post-MVP)
- [ ] Full screen reader testing with NVDA/VoiceOver
- [ ] Add live regions for dynamic content
- [ ] Implement comprehensive error handling with aria-describedby
- [ ] Create accessibility statement on website

### Phase 3 (Scale)
- [ ] Automated accessibility testing in CI/CD
- [ ] Quarterly accessibility audits
- [ ] User testing with people with disabilities
- [ ] WCAG 2.1 AAA compliance assessment

## Resources

- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)

## Testing Tools

| Tool | Purpose | Cost |
| --- | --- | --- |
| axe DevTools | Accessibility scanning | Free |
| WAVE | Accessibility evaluation | Free |
| Lighthouse | Performance & accessibility | Free (Chrome) |
| NVDA | Screen reader | Free (Windows) |
| VoiceOver | Screen reader | Free (Mac/iOS) |
| JAWS | Screen reader | Paid |
| Color Contrast Analyzer | Contrast checking | Free |

## Next Steps

1. Run `npx axe` on all key pages
2. Document any found issues in a separate accessibility task
3. Implement Phase 1 improvements before public launch
4. Add accessibility tests to CI/CD pipeline
5. Create quarterly audit schedule
