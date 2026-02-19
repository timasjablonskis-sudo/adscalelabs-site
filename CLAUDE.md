# CLAUDE.md — AdScale Labs Site

Single-file static site. Everything lives in `index.html` — styles, markup, and JS are all inline.

## Stack

- **Vanilla HTML/CSS/JS** — no framework, no build step
- **GSAP 3.12.5** + **ScrollTrigger** — all animations
- **Fonts**: Bebas Neue (display/numbers), Space Mono (labels/UI), DM Sans (body)
- **Deployment**: Vercel (`adscalelabs-site.vercel.app`)

## Design Tokens

```
--bg:     #EDECEA   (warm off-white, page background)
--black:  #0A0A0A   (primary text, headings)
--white:  #FAFAF8   (card backgrounds)
--lime:   #C8FF00   (accent, CTAs, hover states)
--mid:    #999       (secondary labels)
--border: #D4D1CC   (dividers)
--dark:   #080808   (services section, footer background)
--gray:   #E5E3DF   (subtle backgrounds)
--muted:  #777      (body copy, descriptions)
```

## Typography Rules

- **Bebas Neue** — section headlines, stat numbers, service names, mega text
- **Space Mono** — eyebrows, nav labels, tags, small caps UI, `font-size: 9–11px`, `letter-spacing: 0.1–0.14em`, `text-transform: uppercase`
- **DM Sans** — body copy, `font-weight: 300`, `line-height: 1.8–1.9`
- Italic DM Sans — pull quotes, handwritten-feel callouts

## Brand Voice

Minimal, direct, confident. No fluff. Short sentences. "We build" not "We specialize in providing." Lead with the benefit, not the feature.

## Services (what AdScale Labs offers)

1. **Websites** — custom business sites, landing pages
2. **AI Agents** — lead generation, outreach, workflow automation
3. **Lead Scraping** — sourcing and qualifying prospects
4. **Email Automation** — sequences, follow-ups, drip campaigns
5. **Workflows** — end-to-end business process automation
6. **Data Pipelines** — collect, clean, act on business data

## Page Structure (in order)

1. `#loader` — count-up loader, covers page on init
2. `nav` — fixed 5-col grid, logo + nav pill + location
3. `#hero` — intro paragraph, CTA, 3D mini cube, headline + outlined text
4. `#stats-bar` — 3-stat credibility bar (7 days / 24/7 / 100%)
5. `#automate-scale` — mega AUTOMATE/SCALE typography section
6. `#overflow-section` — parallax marquee text + floating symbols + overlay card
7. `#about` — 2-col grid: left (copy) / right (stat column + circle badge). Eyebrow: `01 — About`
8. `#process` — 3-step how-it-works. Eyebrow: `03 — How It Works`
9. `#principles` — 3-col principles grid. Eyebrow: `04 — Our Principles`
10. `#cube-section` — pinned scroll-driven 3D cube, rotates through 4 services
11. `#services` — dark section, large stacked service list
12. `#contact` (footer) — 3-col: email / location+copy / logo+links

## Animation Conventions

- All elements start hidden via `primeStates()` (called at loader end, before loader exits)
- Hero elements animate in immediately after loader exits (no ScrollTrigger, direct `gsap.to`)
- All other sections use `ScrollTrigger` with `once: true` and `start: 'top bottom'`
- Stagger: `0.1–0.15` for lists, `0.12` for grid items
- Durations: `0.7–1.1s` depending on element weight
- Eases: `expo.out` for big moves, `power3.out` for subtle, `back.out(1.5)` for scale-in

## Custom Cursor

- Only active on pointer-fine devices (`@media (pointer: fine)` in CSS, `window.matchMedia` guard in JS)
- `.cursor` — 8px dot, snaps instantly
- `.cursor-follower` — 34px circle, lags behind; expands to 52px on hover (`.hovering` class on body)

## Key Patterns

**Adding a new section:**
1. Add CSS (mirror nearest equivalent section's padding/layout)
2. Add HTML in correct order
3. Add `gsap.set(...)` in `primeStates()` for hidden state
4. Add `gsap.to(...)` with ScrollTrigger in `setupAnimations()`
5. Update any section eyebrow numbers if needed

**Section eyebrow format:** `Space Mono, 10px, uppercase, var(--mid)` — e.g. `01 — About AdScale Labs`

**Responsive breakpoints:**
- `960px` — single-column grids, hide nav labels, stack contact footer
- `480px` — tighter padding, hide overflow card, scale down fonts

## Contact

`adscalelabs@gmail.com`
