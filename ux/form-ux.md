# Form UX Best Practices

## Question Order (Minimize Friction)
1. **Start easy**: Household size, ZIP code (low commitment, builds momentum)
2. **Build trust**: Employment status, basic income
3. **High friction last**: SSN, detailed financial info (only if absolutely required)

## Progressive Disclosure
- Show 3-5 questions at a time. Multi-page forms reduce cognitive load.
- "Why do we ask this?" tooltips for sensitive questions (income, disability status).
- Conditional logic: Only show housing questions if user indicates need.

## Input Types
- Use native HTML5 inputs: `type="number"` for income, `type="tel"` for phone.
- Date pickers for mobile (avoid manual typing).
- Radio buttons > dropdowns for &lt;6 options.

## Validation
- Inline validation: Mark fields valid/invalid as user types (not on blur).
- Specific error messages: "Income must be a number" not "Invalid input".
- Auto-advance: ZIP code → auto-focus next field after 5 digits entered.

## Save Progress
- Store form state in localStorage. User can close tab and resume.
- No account required for MVP.
