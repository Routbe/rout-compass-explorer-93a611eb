# Roadmap

## Done
- [x] Import GitHub repo Routbe/rout-compass-explorer 1:1 into this project
- [x] Link Neon database connection (linked as owner role; app needs a rout_app login — waiting on user)
- [x] Review the whole codebase
- [x] Rewrite README.md (extensive, no platform references)

## Open (request 2026-11-05)
1. Visual profile widgets
   - [x] Studio "Add widget" catalog with the 9 visual widgets
   - [x] Per-widget settings panel (shared city, URL validation, date picker)
   - [x] Tile size choice per widget
   - [x] Public rendering in ProfileView
2. Logo bar under the bio
   - [x] Per-link display choice (button / logo / both)
   - [x] Logo bar renders per-link choice
   - [x] Hint at 4th logo; wrap/scroll option in Design tab only when > 5 logos; scroll uses DragMarquee
3. Command Center
   - [x] Spotify status shares the Studio/Hub connection (album art, progress, track info)
   - [x] Command Center weather defaults to the profile city
4. Google Wallet pass
   - [x] Pass colours harmonised with profile colours (OKLab)
   - [x] High-res logo, monogram, badge on the pass
   - [ ] Live test with service account keys (blocked: keys not configured in this project)
5. Agent zero-knowledge handoff
   - [x] Unclaimed agent designs encrypted at rest with the rsk_ key
   - [x] Claim-flow tests (signed-in and anonymous)
6. Configuration & maintenance
   - [x] OMNI_RENDER_HOSTS strict parser + recommended list
   - [ ] Set OMNI_RENDER_HOSTS on the worker server (blocked: server environment is outside this project)
   - [x] Verify cleanup cron for temporary QR files and expired uploads

## Blockers
- Google Wallet and Spotify keys are not configured here, so live tests against Google and Spotify cannot run.
- No daily scheduler is committed (`vercel.json` absent); the owner must schedule `cleanup-assets`.
- Neon connection uses the owner role; the app requires a login granted `rout_app`.
- New SQL migrations are written but never auto-applied; the owner reviews and applies them.
