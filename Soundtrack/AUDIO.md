# Biome Quest — Audio plan (reuse + new)

The whole Earth Quest soundtrack was copied here. The **SFX are reusable as-is** (named by game event,
not theme). The **music maps by mood** to Biome Quest's zones. Only a few pieces are worth making new
in ElevenLabs — prompts for those are at the bottom.

---

## 1. SFX — reuse as-is (in `Short Clips/`)

These cover essentially every Biome Quest sound event. Wiring map:

| File | Biome Quest event |
|---|---|
| `sfx.UI Button or Menu Select.mp3` | every menu / HUD button click |
| `sfx.Portal.mp3` | portal travel (hub ↔ zone), teleport into a boss arena |
| `sfx.correct answer.mp3` | correct answer (minigames + boss combat) |
| `sfx.Wrong Answer.mp3` | wrong answer (minigames + boss combat) |
| `sfx.collecting coins.mp3` | gold reward |
| `sfx.Level Up.mp3` | level up |
| `sfx.Loot or Gear Unlocked.mp3` | uncommon gear drop on the celebration screen |
| `sfx.success.mp3` | minigame **passed** / celebration appears |
| `sfx.Minigame fail.mp3` | minigame completed but **didn't pass** |
| `sfx.Arena Unlock.mp3` | boss gate **unlocks** (enough minigames mastered) |
| `sfx.Boss Defeated.mp3` | boss victory |
| `sfx.LosttoBoss.mp3` | boss defeat |
| `sfx.Zone Completed.mp3` | finishing a zone / seating a DNA Strand in the Genome Gate |
| `sfx.Drinking.mp3` | using a consumable / potion |
| `sfx.Calming or Settling a Phenomenon.mp3` | a "restore" moment (e.g. the World Tree reviving in the finale) |
| `sfx.Jump.mp3` | jump (if we add one) |

**Verdict: no new SFX needed.** The library is complete for what we're building.

---

## 2. Music — reuse by mood (zone tracks + boss + opening)

Suggested mapping (all reusable; the two ⭐ rows are where a custom track would feel more "Life Science"):

| Biome Quest use | Reuse this Earth Quest track | Fit |
|---|---|---|
| Title screen / main menu | `EQOpeningSong.mp3` | grand opener, works as-is |
| Intro cutscene (withered-tree story) | `Music - Intro Cutscene.mp3` | ✅ custom-made |
| The Heartwood (hub) | `Music - Heartwood.mp3` | ✅ custom-made |
| Kingdom Reaches (S7L1) | `StarfallST.mp3` | wondrous, varied — good fit |
| Inner Vasts (S7L2) | `TidalTerraceST.mp3` | flowing/internal — fits "inside the body" |
| Helix Hollow (S7L3) | `WeatherworksST.mp3` | luminous/airy — fits the genetics garden |
| Web of Wilds (S7L4) | `TheWatershedST.mp3` | lush nature — strong fit |
| Deeptime Drift (S7L5) | `DeepstrataST.mp3` | deep/ancient — **perfect** thematic match |
| The Crown (finale) | `ThecoreST.mp3` | climactic — good fit |
| Boss battle (all bosses) | `BossBattleST.mp3` | generic boss combat — reuse directly |

### Arena reveal / gate stings (in `Boss Zones/`)
The per-zone `*Arena Intro.mp3` and `*Drone Reveal.mp3` clips are short cinematic stings. Reuse one
set for Biome Quest's **gate-opens → teleport → arena reveal** moment (e.g. `Deep Strata Arena Intro.mp3`
as the arena reveal). Per-zone unique stings are optional polish later.

---

## 3. New audio — STATUS: COMPLETE ✅ (no more generation planned)

All the essential custom tracks are made (Heartwood, Intro cutscene, Boss Battle, Boss Arena Reveal,
Boss Gate Opening). **From here everything else reuses the Earth Quest library** (ElevenLabs token
budget) — the optional per-zone / per-boss themes below are NOT being made; the reuse mapping in
section 2 covers them. Prompts kept only for future reference.

### A. The Heartwood — hub theme (Music) ✅ DONE → `Music - Heartwood.mp3`
```
Warm, magical, gently uplifting fantasy exploration theme for a glowing World Tree hub in a kids'
educational RPG. Soft acoustic guitar and harp arpeggios, warm strings, light woodwind (flute),
subtle bell/glockenspiel sparkle, gentle hand percussion. Peaceful and inviting, a sense of wonder
and safety, like a forest sanctuary at golden hour. Mid-slow tempo (~80 BPM), major key, no vocals.
Seamless loop, about 90 seconds. Light and Chromebook-friendly mix, not too busy.
```

### B. Intro cutscene score — "The Withered Tree" (Music) ✅ DONE → `Music - Intro Cutscene.mp3`
```
A short cinematic score for a storybook intro about a great World Tree that gives life to all
creatures, is slowly drained by five shadowy forces, falls dark, then a single spark of hope remains.
Through-composed in three moods over ~70 seconds: (1) warm, wondrous, alive — harp, strings, gentle
choir "aahs", flute; (2) darkening, tense, sorrowful as the light fades — low strings, soft dissonance,
fading warmth; (3) a hopeful, rising resolve at the end — a single tender piano/strings theme blooming
into gentle warmth. Orchestral, emotional but child-appropriate (never scary or harsh), no lyrics.
Ends on an unresolved hopeful note ready to hand off to gameplay.
```

### C. (Optional) Distinct Life-Science zone themes (Music)
Reuse in section 2 already covers these; make these only if you want each zone to feel unique.
```
Kingdom Reaches (Classification): curious, adventurous fantasy theme at a crossroads of six wild
biomes — pizzicato strings, light marimba, woodwinds, a sense of discovery and variety. Looping ~90s,
major, no vocals, Chromebook-light.
```
```
Inner Vasts (Cells & Body): wondrous "miniature world inside a living body" theme — soft synth pads,
gentle pulsing heartbeat-like percussion, bell tones, flowing arpeggios, bioluminescent and floaty.
Looping ~90s, no vocals, Chromebook-light.
```
```
Helix Hollow (Genetics): shimmering, luminous "garden of life" theme — glassy synths, harp, soft
choir pad, twinkling mallets, a sense of elegant patterns and growth. Looping ~90s, no vocals,
Chromebook-light.
```
```
Web of Wilds (Ecology): lush, living ecosystem theme blending forest, savanna and ocean textures —
acoustic guitar, light tribal percussion, woodwinds, warm strings, alive and balanced. Looping ~90s,
no vocals, Chromebook-light.
```
```
Deeptime Drift (Evolution): ancient, vast, awe-inspiring deep-time theme — low drones, sparse piano,
slow strings, distant percussion, a feeling of fossils and immense time. Looping ~90s, no vocals,
Chromebook-light.
```

### D. (Optional) Finale victory fanfare — "The Crown restored" (Music)
```
A triumphant but tender victory cue for restoring a magical World Tree to full radiant life in a
kids' RPG finale — soaring strings, warm horns, gentle choir, harp and bells, building to a hopeful,
glowing major-key climax and a soft resolved ending. Orchestral, emotional, child-appropriate, no
lyrics, about 25–35 seconds, not looping.
```

### E. Boss arenas — new audio (the epic gate + 6 unique arenas)
**✅ DELIVERED (2026-06-22):** `Music - Boss Battle.mp3` (use for all boss fights — supersedes the reused
`BossBattleST.mp3`), `Music - Boss Arena Reveal.mp3` (teleport-in + boss reveal sting), and
`Short Clips/sfx.Boss Gate Opening.mp3` (the doors grinding open). Reuse still covers the unlock chime
(`sfx.Arena Unlock`), teleport (`sfx.Portal`), and win/lose (`Boss Defeated`/`LosttoBoss`).
*The original prompts are kept below for reference / optional per-boss variants.*

**Boss Gate opening (SFX):**
```
A huge, ancient stone gate unlocking and its massive doors slowly grinding open, with a deep
rumble, heavy scraping stone, falling chains, and a warm magical energy surge swelling underneath.
Epic and triumphant, fantasy game sound effect, about 5 seconds, clean (no music, no voices).
```

**Boss arena reveal / boss intro sting (Music, ~15s):**
```
A short, dramatic cinematic reveal sting for entering a climactic boss arena in a kids' fantasy RPG.
Big swelling orchestral brass and strings, a deep impact hit, choir "aahs", a tense rising swell that
lands on a powerful, awe-struck chord. Epic and imposing but NOT scary or gory. No lyrics, about 15
seconds, ends ready to lead into battle music.
```

**Biome Quest boss battle theme (Music loop, optional upgrade over BossBattleST):**
```
A driving, heroic-but-tense boss battle theme for a 7th-grade Life Science fantasy RPG. Fast
orchestral strings ostinato, bold brass, taiko/timpani percussion, urgent but exciting. Energetic,
kid-appropriate, no lyrics. Seamless loop, ~90 seconds, ~140 BPM, Chromebook-friendly.
```

**Optional per-boss themes** — template, swap the boss line:
```
A 90-second looping boss battle theme for a Life Science RPG, kid-appropriate (no lyrics, never
harsh), epic orchestral + percussion, Chromebook-friendly. This boss's character: <BOSS LINE>
```
- Chimerus (Classification): shapeshifting — restless, morphing motifs that keep changing instruments.
- The Contagion (Cells/Body): invading sickness — pulsing, urgent, heartbeat-like percussion.
- The Replicator (Genetics): self-copying — echoing, canon-like repeating phrases that stack.
- The Blight (Ecology): creeping ecosystem collapse — heavy/encroaching, opening to hopeful restoration.
- The Everchanging (Evolution): constantly adapting — a theme that mutates and grows each cycle.
- The Withering (Finale): the grandest, most climactic and epic — the final unraveling force.

---

## Notes
- All reuse files are Derek's own ElevenLabs-generated Earth Quest audio — fine to reuse here.
- When wiring audio in the engine: keep it **muted by default / respect a mute toggle** (school
  machines), preload small SFX, stream the longer music tracks.
