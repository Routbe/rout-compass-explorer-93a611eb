# Roadmap

## Done
- [x] Import GitHub repo Routbe/rout-compass-explorer 1:1 into this project
- [x] Link Neon database connection (linked as owner role; app needs a rout_app login — waiting on user)
- [x] Review the whole codebase
- [x] Rewrite README.md (extensive, no platform references)

## Open (request 2026-11-05)
1. Visual profile widgets
   - [ ] Studio "Add widget" catalog with the 9 visual widgets
   - [ ] Per-widget settings panel (shared city, URL validation, date picker)
   - [ ] Tile size choice per widget
   - [ ] Public rendering in ProfileView
2. Logo bar under the bio
   - [ ] Per-link display choice (button / logo / both)
   - [ ] Logo bar renders per-link choice
   - [ ] Hint at 4th logo; wrap/scroll option in Design tab only when > 5 logos; scroll uses DragMarquee
3. Command Center
   - [ ] Spotify status shares the Studio/Hub connection (album art, progress, track info)
   - [ ] Command Center weather defaults to the profile city
4. Google Wallet pass
   - [ ] Pass colours harmonised with profile colours (OKLab)
   - [ ] High-res logo, monogram, badge on the pass
   - [ ] Live test with service account keys (blocked: keys not configured in this project)
5. Agent zero-knowledge handoff
   - [ ] Unclaimed agent designs encrypted at rest with the rsk_ key
   - [ ] Claim-flow tests (signed-in and anonymous)
6. Configuration & maintenance
   - [ ] OMNI_RENDER_HOSTS recommended list (worker host env; set on the VPS)
   - [ ] Verify cleanup cron for temporary QR files and expired uploads

## Blockers
- Neon connection uses the owner role; the app requires a login granted `rout_app`.
- New SQL migrations are written but never auto-applied; the owner reviews and applies them.
