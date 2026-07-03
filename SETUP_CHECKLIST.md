# Biome Quest — go-live checklist (Derek)

The code is done and tested. These are the external steps to wire it up — the
**exact same playbook you ran for Earth Quest**, just with Biome-Quest names.
Do it all in **TEST mode** first, run the end-to-end test at the bottom, then
flip to LIVE.

Everything you copy-paste is in `GO-LIVE-COPY-PASTE.md` (SQL, env vars, etc.).

---

## 1. Supabase — tables (one-time)
Same Supabase project as Science Quest / Earth Quest / the hub. Open **SQL
Editor**, paste the block from **`GO-LIVE-COPY-PASTE.md` → §1**, Run. (Your
existing `quest_*` and `eq_*` tables are untouched — these are new `bq_*`
tables, including the free-trial `trial_ends` column.)

## 2. Supabase — private bucket (one-time)
- **Storage → New bucket → name it exactly `biomequest`** → **Private** (NOT public).
- Upload these 3 files into the bucket, renaming as shown:

  | Upload this file from your **Desktop\Biome Quest** folder | Save it in the bucket as |
  |---|---|
  | `biome_quest.html` | **`game.html`** |
  | `biome_quest_leaderboard.html` | **`leaderboard.html`** |
  | `Biome Quest - Teacher Guide.pdf` | **`guide.pdf`** |

- To push a game update later, just re-upload `biome_quest.html` as `game.html`
  (reaches students within ~1 hour).

> ⚠️ **Use `biome_quest.html` (the ~220 KB engine file), NOT the 38 MB
> `biome_quest_standalone.html`.** Vercel serverless functions can't return a
> 38 MB response — it would break. Biome Quest works exactly like Earth Quest:
> the **game engine HTML is gated** (only served with a valid code), and its
> art/music/mini-games ride along as **public files already committed in this
> repo**. `api/game.js` injects a `<base href>` so those load. Verified
> end-to-end in a production simulation: game, mini-games, lessons, cutscenes,
> and all audio load, with **zero requests to any outside site** (school-filter
> proof).

## 3. Stripe — product, price, webhook
- **Products → New** → "Biome Quest" → one-time price **$19.99** → copy the
  **price id** into `STRIPE_PRICE_BIOMEQUEST`. (Make it in TEST first, then
  again in LIVE at launch.)
- **Developers → Webhooks → Add endpoint** → URL
  `https://biomequest.tobinscience.com/api/webhook` → event
  **`checkout.session.completed`** → copy the signing secret into
  `STRIPE_WEBHOOK_SECRET`.

## 4. Vercel — new project
- Create a **new** Vercel project from the `biome-quest` GitHub repo (separate
  from Science Quest / Earth Quest).
- Add all env vars from **`GO-LIVE-COPY-PASTE.md` → §2**. Reuse the hub's
  `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM`
  (identical to your other games).
- Set `SITE_ORIGIN` to the deployed URL.
- Add the subdomain **`biomequest.tobinscience.com`** (Vercel → Domains; add the
  CNAME it gives you at your DNS host).

## 5. End-to-end test (TEST mode, before going live)
1. Open the site root → **Buy** → pay with Stripe test card `4242 4242 4242 4242`.
2. `welcome.html` shows your dashboard link; the same link is emailed.
3. Dashboard shows **150 `BIOME-` codes**. Paste a roster → names fill codes.
4. Open `play.html`, enter one code → **Enter the game** → the game loads with
   all mini-games, lessons, cutscenes, and music.
5. Re-enter the same code → "Welcome back! Same seat." (no second seat used).
6. **Reset for new year** → seats/labels clear.
7. `recover.html` with the buyer email → link re-emailed.
8. `district.html` with an `@cherokeek12.net` email → activation link → free
   dashboard, no charge.
9. **Free week:** on the store page, enter an email → confirm link → dashboard
   shows **5 unlocked + 145 locked** with a 7-day countdown → the "Unlock for
   life" button runs the $19.99 upgrade **in place**.
10. Open **Hall of Scientists** and **Teacher Guide** from the dashboard.

## 6. Go live
Swap the 3 Stripe env vars to LIVE values (secret key, price id, webhook
secret). No code change. Optionally list on TPT and add a card on
tobinscience.com's home page.

---
### Everything included (same as Earth Quest)
- $19.99 one-time → **150 reusable student codes**, reset free every year.
- **Free week**: 5 seats for 7 days on email confirm, upsell to 150-for-life.
- **Cherokee County** teachers: free with an `@cherokeek12.net` email.
- **Heartwood Hall of Scientists** leaderboard + **Teacher Guide** PDF, both in
  the dashboard.
