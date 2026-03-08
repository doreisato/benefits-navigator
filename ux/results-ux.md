# Results Page UX

## Cognitive Load Management
**Problem**: 20+ programs overwhelm users. They freeze and do nothing.

**Solution**: Tier results by probability.

### Layout
```
[ Top 3 Matches — Likely Eligible ]
- SNAP (Food Assistance) — $250/month
  [Apply Now] [Learn More]
  
- Medicaid (Health Coverage)
  [Apply Now] [Learn More]

- LIHEAP (Energy Assistance)
  [Apply Now] [Learn More]

[ Show 7 More Potential Matches ▼ ]
```

## Program Cards
Each card must include:
- **Program name** (avoid acronyms without explanation)
- **Benefit estimate** (dollar amount or "Free health coverage")
- **Eligibility confidence**: "Likely eligible" / "May qualify"
- **Primary CTA**: "Apply Now" (links to .gov portal)
- **Secondary CTA**: "Learn More" (expands inline details)

## No Dead Ends
If zero matches:
- "Based on your info, we didn't find matches. Here are programs to explore:"
- Show 3 closest programs with "Check eligibility on [Program Site]" links.

## Readiness Checklist
For high-confidence matches, show:
- "What you'll need to apply:"
  - Proof of income (pay stubs, tax return)
  - ID (driver's license, passport)
  - Proof of residence (utility bill)
