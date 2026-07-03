# Biome Quest — copy-paste windows

Everything here is meant to be copied whole. Follow `SETUP_CHECKLIST.md` for the
order; this file just holds the big paste-able blocks.

---

## §1 — Supabase SQL (paste into SQL Editor → Run)

```sql
-- Biome Quest: owners (teachers) + their 150 codes each.  New bq_* tables;
-- your quest_* and eq_* tables are untouched.
create table if not exists bq_owners (
  id uuid primary key default gen_random_uuid(),
  access_token text unique not null,
  email text,
  source text default 'purchase',          -- 'purchase' | 'district' | 'trial'
  trial_ends timestamptz,                   -- set only for free-week trial owners
  stripe_customer text,
  stripe_payment_intent text,
  created_at timestamptz default now()
);
create index if not exists bq_owners_email_idx on bq_owners (lower(email));
create index if not exists bq_owners_pi_idx    on bq_owners (stripe_payment_intent);

create table if not exists bq_codes (
  code text primary key,                    -- e.g. BIOME-7K2PX
  owner uuid references bq_owners(id) on delete cascade,
  label text,                               -- optional student name
  activated_at timestamptz,                 -- set when a seat is first used
  created_at timestamptz default now()
);
create index if not exists bq_codes_owner_idx on bq_codes (owner);

-- Lock the tables down. No public policies => no public access.
-- The server uses the SERVICE ROLE key, which bypasses RLS.
alter table bq_owners enable row level security;
alter table bq_codes  enable row level security;
```

---

## §2 — Vercel environment variables

Add each of these in the new Vercel project → Settings → Environment Variables.
The four "reuse" values are **identical to your Earth Quest / Science Quest
projects** — copy them straight over.

### TEST mode (set these first)

| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` (Stripe sandbox → Developers → API keys) |
| `STRIPE_PRICE_BIOMEQUEST` | `price_…` (the **Biome Quest** TEST product/price you make) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` (from the webhook you register) |
| `SUPABASE_URL` | `https://fmbdoxfkjldvpkyryqlx.supabase.co` *(reuse — same as your other games)* |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_…` *(reuse — same as your other games)* |
| `RESEND_API_KEY` | `re_…` *(reuse)* |
| `RESEND_FROM` | `Biome Quest <hello@tobinscience.com>` |
| `SITE_ORIGIN` | your deployed URL (the `…vercel.app` URL while testing, then `https://biomequest.tobinscience.com`) |

### LIVE mode (flip these at launch — nothing else changes)

| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_…` |
| `STRIPE_PRICE_BIOMEQUEST` | the **LIVE** Biome Quest price id |
| `STRIPE_WEBHOOK_SECRET` | the **LIVE** webhook signing secret |
| `SITE_ORIGIN` | `https://biomequest.tobinscience.com` |

---

## §3 — The 3 files that go in the private `biomequest` bucket

| From `Desktop\Biome Quest\` | Bucket filename |
|---|---|
| `biome_quest.html`  *(the ~220 KB engine — NOT the 38 MB standalone)* | `game.html` |
| `biome_quest_leaderboard.html` | `leaderboard.html` |
| `Biome Quest - Teacher Guide.pdf` | `guide.pdf` |

---

## §4 — Stripe webhook

- Endpoint URL: `https://biomequest.tobinscience.com/api/webhook`
- Event to send: `checkout.session.completed`
- Copy the signing secret → `STRIPE_WEBHOOK_SECRET`.
