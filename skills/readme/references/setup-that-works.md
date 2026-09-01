# Setup that works on a stranger's machine

The quick start is the most commonly false claim in a hackathon README, and it is the
one claim a technical judge is most likely to test. Someone who hits an error on line
three stops evaluating your project and starts debugging it, in the least generous
frame available.

## The only test that counts

Your machine is not evidence. It has the keys, the global installs, the right Node
version, and a `.env.local` you forgot you wrote.

```bash
cd /tmp && rm -rf verify
git clone <your repo url> verify && cd verify
# now follow your own README exactly, line by line, changing nothing
```

Every failure is a bug in the README, not in the environment. Fix the README, then run
the test again from a clean clone. Fifteen minutes here is worth more than an hour of
writing.

Do this **before** the last hour. It routinely surfaces an uncommitted file, and
discovering that at T-20 is a different problem than discovering it at hour 20.

## The five failures that only appear elsewhere

Ranked by frequency:

1. **An uncommitted file.** Usually a config, a schema, an ABI, or a generated client
   that is in `.gitignore` and has been on your disk since hour two.
   ```bash
   git status --ignored --short | head -30   # is anything important ignored?
   git ls-files | wc -l                      # does the count look right?
   ```
2. **A missing env var** that exists in your shell and in the host dashboard, but not
   in `.env.example`.
3. **A Node or package manager version mismatch.** You are on 22, the judge is on 18,
   and a dependency fails to build with an unreadable error.
4. **A missing setup step you do not remember taking.** A database push, a contract
   deploy, a seed script, a `chmod`.
5. **An absolute path or a hardcoded localhost port** in a config file.

## .env.example

Commit it, with every key present and every value empty. It is the contract between
your repo and the stranger running it.

```bash
# .env.example
DATABASE_URL=          # Postgres connection string. Supabase free tier is fine
OPENAI_API_KEY=        # platform.openai.com/api-keys
RPC_URL=               # any Sepolia RPC. Alchemy or a public endpoint
NEXT_PUBLIC_APP_URL=   # http://localhost:3000 for local development
```

The comment on each line matters as much as the key. "Where do I get one of these" is
the question that stops a developer judge, and answering it inline costs you nothing.

Generate it from reality rather than memory, then check nothing leaked:

```bash
grep -rhoE "process\.env\.[A-Z_]+" src/ | sort -u    # every var the code reads
grep -c "=$" .env.example                            # every value should be empty
diff <(grep -oE "^[A-Z_]+" .env.example | sort) \
     <(grep -rhoE "process\.env\.[A-Z_]+" src/ | sed 's/process\.env\.//' | sort -u)
```

That last diff is the real check: it tells you which variables the code reads that your
example file never mentions, which is exactly the failure mode.

**Flag keys a stranger cannot obtain.** If your demo needs a sponsor key from a private
allowlist, say so plainly rather than letting the run fail with an authentication
error:

```markdown
> `SPONSOR_API_KEY` was issued to us at the event and cannot be self served.
> Without it the app runs against recorded fixtures: set `DEMO_MODE=fixture`.
```

That note converts a broken setup into a working one, and it is honest about a real
constraint rather than hiding it.

## Pin the runtime

```json
{ "engines": { "node": ">=20" }, "packageManager": "npm@10.8.2" }
```

And one line in the README:

```markdown
Requires Node 20 or later and npm. Tested on Node 20.11 and 22.4.
```

Commit the lockfile. A repo without a lockfile resolves to different dependency
versions on someone else's machine, and hackathon dependency trees are full of
packages that shipped a breaking change last week.

## The quick start block

Short, copy pasteable, in one block, with no prose between the commands:

```bash
git clone <repo> && cd <repo>
cp .env.example .env.local     # fill in the keys, see below
npm install
npm run db:push                # skip if there is no database
npm run dev                    # http://localhost:3000
```

Then, immediately after: what a successful run looks like. This is the step almost
every README omits, and it is what lets someone know whether it worked.

```markdown
You should see the dashboard with three seeded tasks. Click **Run** on any of them
to watch the agent execute. With no API key set, the run replays a fixture.
```

That last sentence is doing real work: it means a judge without your keys still sees
the product. If the architecture has a seam (see `/skillz:architecture`), say so
here, because a repo that runs without credentials is dramatically more likely to
actually be run.

## Never commit secrets

```bash
git log --all -p | grep -iE "sk-[a-zA-Z0-9]{20}|PRIVATE_KEY=.|API_KEY=." | head
grep -rl "sk-\|API_KEY\|SECRET" .next/static 2>/dev/null && echo "LEAK IN BUNDLE"
```

The first command checks history, not just the working tree. A key removed in a later
commit is still in the repo and still scannable by the bots that watch public pushes;
scanners find committed keys within minutes of a push.

If a key was ever committed: **rotate it**. Rewriting history does not help, because it
has already been fetched. Rotating takes two minutes and is the only fix.

Anything prefixed `NEXT_PUBLIC_` ships to the browser. Nothing secret gets that prefix.

## The repository tree section

Keep it short and keep it true. A tree listing folders that do not exist, or omitting
the one that matters, is a small error that reads as a large one.

```bash
git ls-files | awk -F/ 'NF>1 {print $1"/"$2}' | sort -u | head -20
```

Annotate only the folders a reader needs to find:

```text
src/app/          routes and API handlers
src/lib/          the agent loop, the sponsor integrations, the seam
contracts/        Solidity, deployed to Sepolia
assets/           screenshots the README points at
```

Skip `node_modules`, `.next`, config files, and any folder whose name explains itself.
The purpose of this section is to answer "where is the interesting code", so point at
the interesting code and stop.
