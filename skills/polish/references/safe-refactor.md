# Safe refactoring under a deadline

Renaming is the highest risk activity in this skill and the one with the least
proportionate reward. A better name is worth a point of perceived quality. A broken
build at hour 34 is worth the entire project. Read this before the first rename.

## The precondition

**The build must be green before you start.** If it is not, you cannot attribute a later
failure to your change, and you will spend the hours you have left bisecting your own
polish pass.

```bash
git status --porcelain          # must be empty. commit first
npm run build                   # must pass. if not, stop and fix
git commit --allow-empty -m "checkpoint before polish"
```

That checkpoint is the whole safety net. It makes the entire pass revertible with one
command, which converts a scary operation into a cheap one.

## The loop

One rename. Build. Commit. Repeat.

```bash
# 1. one change
git mv src/lib/utils.ts src/payments/settlement.ts

# 2. fix the imports it broke
grep -rn "lib/utils" src/ --include='*.ts' --include='*.tsx'

# 3. verify
npm run build && npx tsc --noEmit

# 4. commit, so the next failure has one obvious cause
git commit -am "refactor: name settlement module for what it does"
```

**Never batch renames.** Five renames then one build tells you something broke and
nothing about which one. Five renames with five builds costs four extra minutes and
localizes every failure. Under time pressure the batched version feels faster and is
reliably slower.

## What the compiler will not catch

TypeScript catches most import breakage, which makes renaming feel safer than it is.
These are the ones that fail silently at runtime, on stage:

| Pattern | Why it survives the build |
|---|---|
| **Dynamic imports** | `import(\`./tools/${name}\`)` is a string, not a reference |
| **Next.js route files** | The path IS the URL. Renaming a route changes the URL |
| **API route folders** | `app/api/tasks/route.ts` renamed breaks every fetch to it |
| **String-keyed registries** | `tools["search_flights"]` does not follow a function rename |
| **Env var names** | Renaming `API_KEY` in code without the host dashboard breaks prod only |
| **Config file references** | Paths in `next.config`, `tailwind.config`, deploy config |
| **Test fixture paths** | `fixtures/llm.json` read by string |
| **Anything read by a path string** | Grep for the old name as a string, not as a symbol |

The catch-all, run after every rename:

```bash
grep -rn "oldName" src/ app/ --include='*.ts' --include='*.tsx' --include='*.json'
```

Searching for the old name **as text** finds what the type system cannot. If it returns
anything after a rename, that is your runtime bug, sitting there quietly.

## Never rename

**A deployed contract.** The name is compiled into the deployment and the explorer
verification. Renaming means redeploy, re-verify, update every address in the frontend,
and get testnet funds again. It also invalidates the verified explorer link, which is
frequently the strongest single piece of evidence in the submission. Whatever the
contract is called, it is called that now.

**A route.** In file-based routing the path is the URL. Renaming changes the URL, which
breaks the link in the README, the submission form, the video and anything a judge
already opened.

**An env var.** The code and the host dashboard have to change together, and the failure
appears only in production, which is the one place you will not test again.

**Anything on the demo path with under 6 hours left.** However bad the name. The demo
running is worth more than every naming improvement combined.

## What is actually worth renaming

Only what a reviewer reads:

| Worth it | Not worth it |
|---|---|
| Exported class and function names | Local variables |
| Module and directory names in the README | Private helpers |
| The file holding the hardest work | Test file names |
| A `Manager`/`Helper`/`Utils` on the main path | A `utils.ts` that really is utilities |

A file genuinely full of unrelated small functions is correctly called `utils.ts`.
Renaming it to `SharedDomainInfrastructure` is worse: it is the same code with a name
that now overpromises, and overpromising is the thing this library keeps warning about.

## If it breaks

Give yourself sixty seconds. If the cause is not obvious:

```bash
git reset --hard HEAD          # back to the last green commit
```

There is no partial credit for a half-finished rename, and no judge has ever noticed a
module was named well. Reverting costs one command and zero points. Debugging costs the
hours you needed for rehearsal.

If you have already committed several renames and the failure is somewhere among them:

```bash
git log --oneline | head -10
git reset --hard <last known green commit>
```

This is why each rename is its own commit.

## After the pass

```bash
npm run build && npx tsc --noEmit
grep -rn "oldName" src/ app/ --include='*.ts' --include='*.tsx' --include='*.json'
```

Then run the demo path by hand, in the browser, clicking. A green build proves the code
compiles. It does not prove the button still works, and the button is what is judged.

`assets/verify-polish.sh` automates everything above except the clicking, which nothing
can automate and which is the part that matters most.
