# Architecture skill — customization

Edit this file, not the skill body. `SKILL.md` reads these values and adapts the stack
it picks, the seams it draws, the lanes it assigns and the build order it emits.
Anything left at `auto` is inferred from the idea brief and the repo at design time.

The two knobs that change the output most are `team.size` (how many lanes exist) and
`components` (which subsystems get designed at all). Everything else has a sane default
that is correct for most hacks.

```yaml
# ── Shape of the project ────────────────────────────────────────────────────
components:
  frontend:        true
  backend:         route-handlers  # route-handlers | separate-service | none
  database:        postgres        # postgres | sqlite | none — none is a real answer
  agent:           false           # true => references/agent-architecture.md applies
  onchain:         false           # true => references/onchain-architecture.md applies
  realtime:        none            # none | sse | websocket | polling
  background_jobs: false           # true when any operation exceeds the fn timeout
  file_storage:    false

# ── Stack ───────────────────────────────────────────────────────────────────
stack:
  runtime:         node            # node | python | both — "both" costs a lane
  framework:       next-app
  orm:             auto            # drizzle | prisma | none. auto => what the team knows
  contracts:       none            # foundry | hardhat | none
  llm:             auto            # provider + model, if components.agent
  package_manager: npm

# ── Team ────────────────────────────────────────────────────────────────────
team:
  size:            auto            # decides how many parallel lanes exist
  lanes:           auto            # auto => assigned from size. see SKILL.md step 3
  known_stack:     auto            # what they can write at 3am without reading docs
  weakest_area:    auto            # gets the simplest design and the earliest spike

# ── Deployment ──────────────────────────────────────────────────────────────
deploy:
  host:            vercel          # vercel | railway | fly | render | none (local demo)
  db_host:         supabase        # supabase | neon | railway | local
  worker_host:     none            # railway | fly | none
  network:         testnet         # testnet | mainnet | local — mainnet needs a reason
  fn_timeout_s:    auto            # VERIFY against the host. drives the timeout budget

# ── Demo reliability ────────────────────────────────────────────────────────
demo:
  fixtures:        required        # required | optional | none. required = every dep
  force_fixtures_on_stage: true    # run the live demo on recorded responses
  aha_step:        auto            # the ONE step that gets fallbacks and error handling
  offline_safe:    true            # true => no live external call on the critical path

# ── Time ────────────────────────────────────────────────────────────────────
time:
  build_hours:     auto            # if < 8, skill switches to SALVAGE MODE
  arch_cap_min:    45              # hard cap. ends with a spike running, not a document
  spike_by_hour:   1               # riskiest external call proven by this hour
```

## How the knobs bite

| Knob | Effect on the design |
|---|---|
| `team.size: 1` | No lanes, no typed-contract ceremony. One vertical slice at a time |
| `team.size: 4+` | Lanes become mandatory and the shared types file is written before any code |
| `components.database: none` | No ORM, no schema step, no migrations. In-memory state and seed |
| `components.agent: true` | Adds the tool allowlist, the authorization boundary and a termination condition as required design outputs |
| `components.onchain: true` | Forces an explicit on-chain / off-chain split before any contract is written |
| `components.background_jobs: true` | Adds a worker process and a job table; the API returns immediately everywhere |
| `stack.runtime: both` | Costs a whole lane to the service boundary. The skill argues against it unless the core work is genuinely Python |
| `deploy.fn_timeout_s` | Any operation over it must be a job, not a request. Drives the timeout budget table |
| `demo.fixtures: required` | Every external dependency is generated behind `assets/seam.ts` from the first commit |
| `demo.offline_safe: true` | No live external call on the critical path; the aha step must run from fixtures |
| `time.build_hours < 8` | **SALVAGE MODE** — one process, all fixtures, database optional |

## The one that is usually wrong

`components.backend`. Teams reach for `separate-service` because that is how production
systems look. At a hackathon it means two deploys, two sets of env vars, CORS, and a
second thing that can be down during judging — in exchange for nothing a judge scores.

Choose `separate-service` only when the runtime genuinely differs (Python ML code) or
when something must run longer than a request. Both of those are `background_jobs` or
`stack.runtime: both`, which is to say: the real trigger is elsewhere, and this knob
should follow it rather than lead.
