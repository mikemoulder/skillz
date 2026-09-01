# Polish skill customization

Edit this file, not the skill body. `SKILL.md` reads these values and adapts what it is
allowed to touch, how far it goes, and what it verifies afterward.

Two values decide almost everything: `time.hours_remaining` (which gates every mutative
change) and `build.command` (without which no rename can be verified, and so none is
permitted). Fill those two even if you fill nothing else.

```yaml
# ── The clock. This gates everything ────────────────────────────────────────
time:
  hours_remaining: auto      # >12 all changes | 6-12 renames off demo path
                             # <6 additive only | <2 docs only
  polish_cap_min:  60
  judge_run_first: true      # fixing what is broken outranks surfacing what works

# ── Build verification. No green build, no mutative change ──────────────────
build:
  command:         auto      # e.g. npm run build. REQUIRED for any rename
  typecheck:       auto      # e.g. npx tsc --noEmit. run after every rename
  green_before:    auto      # must be true to start. if false, go fix it
  checkpoint:      required  # a commit before the pass, so it reverts in one command

# ── Off limits. Nothing here is touched, at any hour ─────────────────────────
protected:
  demo_path:       auto      # files the demo runs through. list them
  deployed:        auto      # contracts already deployed and verified. renaming
                             # invalidates the explorer link, your best evidence
  generated:       true      # lockfiles, migrations, build output, codegen
  config:          true      # next.config, tsconfig, CI. polish never needs these

# ── What to surface ─────────────────────────────────────────────────────────
surface:
  evaluation_map:  true      # docs/evaluation-map.md. highest value artifact here
  decisions_doc:   true      # docs/technical-decisions.md. 3-5 real decisions only
  evidence_comments: true    # WHY comments at the call sites that matter
  max_comments:    12        # density destroys signal. this cap is doing real work
  tests_as_evidence: auto    # one test for the hardest behavior beats a coverage number
  readme_pointers: true      # claims link to files. hackathon-readme owns the prose

# ── Renaming ────────────────────────────────────────────────────────────────
rename:
  allowed:         auto      # auto => derived from hours_remaining
  scope:           exported  # exported | files | none. never local variables
  one_at_a_time:   true      # rename, build, commit. batching hides which broke it
  vague_names:     [Manager, Helper, Utils, Service, Handler, Data, Process, run, handle]

# ── Integrity. Not configurable ─────────────────────────────────────────────
integrity:
  evaluator_instructions: forbidden   # never address a reviewer, human or automated
  hidden_text:            forbidden   # no white-on-white, zero-size, or HTML comments
  keyword_stuffing:       forbidden   # written for a machine, not a human, is the tell
  unverified_claims:      forbidden   # never comment on code you did not read
```

## How the knobs bite

| Knob | Effect |
|---|---|
| `time.hours_remaining < 6` | Every rename is refused. The pass becomes docs, comments and tests |
| `time.hours_remaining < 2` | Source is not touched at all. Docs only |
| `build.command: auto` and undiscoverable | Renames are refused; an unverifiable rename is not worth the risk |
| `build.green_before: false` | The skill stops and routes to `hackathon-judge`. You cannot polish a broken build |
| `protected.deployed` set | Those contract names are never touched, at any hour |
| `surface.max_comments` | Above roughly 12, comment density starts hiding the code |
| `rename.scope: none` | Additive only, regardless of clock. Correct for a fragile build |
| `integrity.*` | Not adjustable. See the line in SKILL.md |

## The one that is usually wrong

`time.hours_remaining`. Teams enter the time until the deadline rather than the time
until they must stop changing code, which are different by the two or three hours that
demo rehearsal, the recording and the submission form actually take. Entering the
deadline lets this skill authorize renames during the window that should be a freeze.

Enter the hours until **feature freeze**, not until submission. If you are unsure, take
the smaller number: the cost of an additive-only pass is a few missed renames, and the
cost of a rename at hour 34 is the demo.
