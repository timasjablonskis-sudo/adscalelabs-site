# AdScale Labs

AI Front Desk for Med Spas. Single-file site — everything in `index.html`. Demo chatbot in `demo-chat.js`.

**Stack:** Vanilla HTML/CSS/JS, GSAP 3.12.5 + ScrollTrigger, Lenis smooth scroll
**Deploy:** Vercel (`adscalelabs-site.vercel.app`) — `npx vercel --prod --yes`

**Brand voice:** Minimal, direct, confident. No fluff. Short sentences. Lead with benefit, not feature.

**Animation:** `primeStates()` hides → `setupAnimations()` reveals with ScrollTrigger (`once: true`).
**Adding a section:** CSS → HTML → `gsap.set()` in `primeStates()` → `gsap.to()` in `setupAnimations()`

**Breakpoints:** 960px (single-column), 480px (tighter padding)

**Conventions:** Prefer editing existing files. Don't add comments to unchanged code. Keep solutions minimal.
