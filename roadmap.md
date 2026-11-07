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
   - [x] New "Sovereign Foil" design: ROUT bunny logo, profile tile colour, no photo
   - [x] Fix card tests for the new design
   - [x] Already-saved Google passes get the new design (REST update before the save link)
   - [ ] Owner's Vercel site shows the new work (blocked: GitHub repo Routbe/rout-compass-explorer stops at 5 Nov 10:44; this project is not linked to it, the owner must connect GitHub and point Vercel at it)
   - [x] "Write to NFC sticker" in the share menu (Web NFC, Chrome on Android)
   - [ ] NFC inside the Google Wallet pass (blocked: Smart Tap needs Google approval and certified readers)
5. Agent zero-knowledge handoff
   - [x] Unclaimed agent designs encrypted at rest with the rsk_ key
   - [x] Claim-flow tests (signed-in and anonymous)
6. Configuration & maintenance
   - [x] OMNI_RENDER_HOSTS strict parser + recommended list
   - [ ] Set OMNI_RENDER_HOSTS on the worker server (blocked: server environment is outside this project)
   - [x] Verify cleanup cron for temporary QR files and expired uploads

## E2EVSP protocol (request 2026-11-05, 2nd)
- [x] Signed (Ed25519 did:key), hash-chained events; server checks signature + chain only, stores ciphertext
- [x] Append-only ledger in Neon (db/0208 applied; edits/deletes blocked by trigger, verified live)
- [x] Capability documents for agents (attenuating delegation, revocation as signed event)
- [x] DPoP proofs on every ledger request (one-time, bound to method + URL + key)
- [x] Identity key + signing + DPoP inside the encryption worker
- [x] Owner passkey bootstrap link (scripts/owner-passkey-link.ts), no password
- [x] Test workspaces e2e-agent-*: none found in Neon, nothing to delete
- [x] Parental consent / email forwarding / referrals / newsletter pages: already exist in NL+EN(+FR/DE), in sitemap, linked at sign-up
- [ ] Move profile/workspace data into the ledger and drop the old tables (blocked: each member's browser must re-encrypt their own data first; dropping now deletes 29 accounts)
- [ ] Local SQLite (Wasm) store in the worker (waits on the data move above)
- [ ] Replace rsk_ agent keys and Sign in with ROUT (OAuth) by capabilities (blocked: breaks connected apps; needs migration window)
- [ ] Replace Better Auth by native WebAuthn + DPoP sessions (blocked: 28 of 29 accounts have no passkey yet)
- [ ] Apply pending db/0204-0207 (owner decision: 0207 quarantines accounts without passkey)

## Sign-in & 2FA (request 2026-11-05, 3rd)
- [x] Public + admin sign-in: passkey, e-mail link (+ code), password (+ set/reset password page)
- [x] Second step when 2FA is on: authenticator app, SMS, recovery code or passkey (also after an e-mail link)
- [x] 2FA optional for members, mandatory for admins (setup screen before the admin panel; admins cannot switch it off)
- [x] SMS as 2FA option for members with a verified phone number (settings + admin setup)
- [x] Removed passkey-only quarantine; tests, README, AGENTS.md updated
- [x] Fixed 2 older failing tests (merge list, schema snapshot)
- [ ] Admin sign-in live on rout.dlp.li (blocked: needs a redeploy of this code; preview lacks BETTER_AUTH_SECRET and BREVO_API_KEY)
- [ ] SMS codes live (blocked: SMS provider keys + PHONE_ENCRYPTION_KEY not set here)

## Blockers
- Google Wallet and Spotify keys are not configured here, so live tests against Google and Spotify cannot run.
- No daily scheduler is committed (`vercel.json` absent); the owner must schedule `cleanup-assets`.
- Neon connection uses the owner role; the app requires a login granted `rout_app`.
- New SQL migrations are written but never auto-applied; the owner reviews and applies them.
