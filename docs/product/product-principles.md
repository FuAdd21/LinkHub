# LinkHub Product Principles

## Decision Framework

When facing any engineering or product trade-off, prioritize in this order:

```
1. Security
2. Correctness
3. Data integrity
4. Maintainability
5. Performance
6. User experience
7. Convenience
```

## Product Principles

### 1. One Job, Done Well

LinkHub's job is to turn one URL into a useful professional identity and a meaningful visitor action.

**Before building any feature, ask:**
> "Does this make LinkHub better at turning one URL into a useful professional identity and a meaningful visitor action?"

If the answer is no, don't build it yet.

### 2. Honest Data

- Never show fake numbers. If followers are unavailable, show "unavailable" — not 0.
- Never label scraped data as "Live." Show "Updated 5 min ago."
- Analytics should reflect real visitor behavior, not inflated vanity metrics.
- Deduplicate events. A page refresh is not a new visitor.

### 3. Progressive Disclosure

- The default experience should be simple: profile + links + contact.
- Advanced features (projects, credentials, analytics) are available but not required.
- Don't show 30 controls when 5 will do.

### 4. Mobile First

- The public profile is primarily viewed on mobile.
- Design for 360px first, then scale up.
- Touch targets ≥ 44px.
- No horizontal scrolling. Ever.

### 5. Graceful Degradation

- If a social API is down, show cached data — don't break the page.
- If analytics fail to load, show the profile anyway.
- If an image fails to upload, tell the user clearly — don't silently fail.

### 6. No Premature AI

- Don't add AI features to make the landing page sound modern.
- Add AI only when there's enough behavioral data to make it genuinely useful.
- "AI-powered" is not a product feature — it's an implementation detail.

### 7. Measure Before You Optimize

- Don't optimize queries based on feelings. Run EXPLAIN.
- Don't add caching because "it's best practice." Add it when measured latency requires it.
- Don't add features because competitors have them. Add them when users ask for them.

### 8. Ship Small

- Every change should be independently committable.
- Every commit should leave the application in a working state.
- Never refactor the entire codebase in one pass.

## Engineering Principles

### Code Organization
- Controllers are thin: validate → call service → respond
- Services contain business rules
- Repositories contain database operations
- Schemas define validation rules
- Errors are handled centrally, not per-controller

### Security
- Never store secrets in frontend code (VITE_* variables are public)
- Never log passwords, tokens, or API keys
- Never trust client input — validate everything server-side
- Never expose internal error details to users
- Always use parameterized queries — never interpolate user input into SQL

### Testing
- Test business-critical paths, not every function
- Test authorization boundaries (User A cannot access User B's data)
- Test error cases, not just happy paths
- A test that has never been run is not a test
