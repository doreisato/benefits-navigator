# Accessibility Checklist (WCAG 2.1 AA)

- [ ] **Contrast**: Text-to-background contrast ratio must be at least 4.5:1.
- [ ] **Keyboard Navigation**: 100% of the flow operable via Tab/Enter/Space. Focus states must be highly visible.
- [ ] **Screen Readers**: All form inputs require `<label>` or `aria-label`. No ambiguous link text ("Click here").
- [ ] **Error Identification**: Errors described in text, not just indicated by color (e.g., red outline + "Required field: Date of Birth").
- [ ] **Text Resizing**: UI must function without breaking layout when text is scaled to 200%.
- [ ] **Alt Text**: Informative images require `alt` text. Decorative images must have empty `alt=""`.
- [ ] **Time Limits**: No session timeouts without giving the user the ability to extend.
