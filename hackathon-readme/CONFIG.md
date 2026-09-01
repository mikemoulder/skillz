# README skill customization

Edit this file, not the skill body. `SKILL.md` reads these values and adapts what it
writes, which sections exist, how ambitious the voice is, and which gates run. Anything
left at `auto` is read from the repository at documentation time, never assumed.

The block that changes the output most is `sponsors`, because the sponsor sections are
where track prizes are decided and they are the sections most often written badly.

```yaml
# ── Identity ────────────────────────────────────────────────────────────────
project:
  name:            auto
  one_liner:       auto        # from the idea brief. the sentence a judge repeats
  hackathon:       auto
  tracks:          auto        # which prizes this submission is entered for

# ── Sponsors, in the order they appear in the README ────────────────────────
sponsors:
  - name:          auto
    tech:          auto        # the SDK or API actually imported
    role:          auto        # its architectural role, in three words
    files:         auto        # where it is imported. VERIFY, do not guess
    depth:         auto        # feature | load-bearing | beyond-spec

# ── Proof artifacts. Only list what exists; a dead link costs more than none ─
evidence:
  demo_url:        auto
  video_url:       none
  contract:        none        # address plus explorer link, if verified
  tx_hash:         none        # one real transaction, if the demo transacts
  screenshots:     auto        # committed under assets/screenshots/
  hero_image:      auto        # GIF of the aha moment beats a static shot

# ── Documentation depth ─────────────────────────────────────────────────────
docs:
  readme_max_words: 800        # over this, sections move into docs/
  tree:            minimal     # minimal (README only) | standard (+2 files) | full
  architecture_md: auto        # true when the diagram outgrows the README
  integrations_md: auto        # true when there are 3+ sponsors, or deep integration
  api_md:          false       # rarely earns its place at a hackathon

# ── Voice ───────────────────────────────────────────────────────────────────
style:
  em_dashes:       forbidden   # hard gate. reads as machine written
  ai_attribution:  forbidden   # hard gate, no exceptions. NEVER a Co-Authored-By
                               # trailer, a generated-by footer, or a robot emoji, in
                               # commits, PRs, docs or code comments. not configurable
  ambition:        high        # measured | high | bold. never changes factual claims
  banned_phrases:  default     # see references/voice.md
  person:          we          # we | passive
  audience:        judges      # judges | sponsors | developers. reorders the body

# ── Honesty ─────────────────────────────────────────────────────────────────
honesty:
  what_is_real:    required    # the real / recorded / not-built section
  limitations:     required
  roadmap_split:   required    # Built / Next / Vision, never blended
  fixture_disclosure: auto     # true when the demo runs on recorded responses

# ── Time ────────────────────────────────────────────────────────────────────
time:
  doc_cap_min:     45
  skeleton_by_hour: 2          # write the top of the README while you are fresh
  freeze_before_submit_min: 30 # docs stop changing here. links get verified
```

## How the knobs bite

| Knob | Effect on what gets written |
|---|---|
| `sponsors[].depth: beyond-spec` | That sponsor gets a full paragraph plus a specific story about what surprised you in their SDK. It is the strongest track prize signal available |
| `sponsors[].files` | Populates the `Where` column. Without it the sponsor table is unverifiable and reads as a claim rather than evidence |
| `evidence.video_url: none` | The three link row becomes two. Never emits a link to something that does not exist |
| `evidence.contract` set | Adds the verified explorer link above the fold, and a contracts section |
| `docs.tree: minimal` | Everything stays in the README. Correct for most projects under 800 words |
| `docs.tree: full` | Only when each file has real content. The skill refuses to emit stubs |
| `style.ambition: bold` | Stronger framing, identical factual claims. Never invents an artifact |
| `style.audience: sponsors` | Moves the integration table above the problem section |
| `honesty.fixture_disclosure: true` | Adds the recorded row to the what-is-real section, and a demo data note |
| `time.skeleton_by_hour` | The skill writes the top of the README this early and fills it in as the build proceeds |

## The two that are usually wrong

`docs.tree`. Teams set this to `full` because a five file `docs/` directory looks
serious. It is the opposite: a judge opens `docs/api.md`, finds a heading and nothing
else, and now knows the tree was decoration. Empty structure is worse than no
structure. Start at `minimal` and promote a section only when it genuinely outgrows the
fold.

`style.ambition`. Teams set this low out of caution and undersell real engineering, or
set it high and let it drift into claims nothing supports. Neither is the failure the
setting is for. Ambition governs how significant the work sounds; it never governs what
the work is. High ambition plus strict factual discipline is the combination that wins,
and it is achievable because specificity reads as more impressive than superlatives do.
