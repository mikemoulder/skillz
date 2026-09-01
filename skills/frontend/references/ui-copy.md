# UI copy

Judges read the words. In the ten seconds they spend on your first screen they read
exactly three things: the heading, the button, and whatever the empty state says. Those
three strings do more work than any amount of visual polish, and almost every hackathon
team writes them last, in thirty seconds, at 4am.

## No em dashes

Never use the em dash character in UI text, seed data, alt text, page titles, meta
descriptions, or toast messages. Use a comma, a colon, a period, or parentheses.

The two `Before:` lines below are the only intentional em dashes in this skill. They are
specimens, not prose. Do not "fix" them.

```text
Before:  Everything flagged in the last 24 hours — highest risk first.
After:   Everything flagged in the last 24 hours, highest risk first.

Before:  Connect a source — findings appear within a minute.
After:   Connect a source. Findings appear within a minute.
```

The reason is sharper here than in documentation. The em dash reads as machine written
text, and this is not a document describing the product, it **is** the product. A judge
who reads your interface as generated concludes the whole thing was generated, which is
the impression the entire skill exists to prevent.

Check before every demo, including after any copy edit:

```bash
grep -rn $'\xe2\x80\x94' src/ --include='*.tsx' --include='*.ts' && echo "EM DASH IN UI"
```

## Write how a person talks

The failure mode is not bad grammar. It is copy that is fluent, generic, and could
describe any product ever built.

| Do not write | Write |
|---|---|
| "Seamlessly manage your workflows" | "Review flagged items" |
| "Empower your team to do more" | "Three people can work the queue at once" |
| "Get started in seconds" | "Connect a source" |
| "Unlock the power of your data" | "Search 12,000 filings" |
| "Your one stop solution for X" | [delete it, say what the screen shows] |
| "Effortlessly streamline everything" | [delete it] |
| "Welcome to Dashboard!" | "Review queue" |

The test: **read it out loud.** If you would not say the sentence to a colleague
standing next to you, do not ship it. "Seamlessly manage your workflows" fails
immediately; "Everything flagged in the last day, worst first" passes.

Two mechanical rules that carry most of the improvement:

- **Sentence case, not Title Case.** "New review", not "New Review". Real products use
  sentence case and title case reads like a slide deck.
- **No exclamation marks.** Not one. They read as nervous, and every place you want one
  is a place the sentence should be more specific instead.

## Per element

### Page title

A noun phrase naming what this screen is. Not the product name, not "Dashboard", not
"Home".

```text
weak:    Dashboard
better:  Review queue
```

### The description line

One sentence under the title saying what the screen is for, in the user's words. This is
the single highest value string in the interface, and most hacks omit it entirely, which
means the judge spends their ten seconds working out what they are looking at.

```text
Everything flagged in the last 24 hours, highest risk first.
```

### Buttons

Verb plus object, naming the specific thing that happens. The user should be able to
predict the result before clicking.

```text
weak:    Submit,  OK,  Get started,  Continue
better:  Connect a source,  Run the review,  Send payment
```

### Empty states

Three parts: what goes here, why it is empty, and the action. This is where judges land
by accident, which makes it where the polish score is decided.

```text
title:  Nothing flagged yet
body:   Connect a data source and findings appear here within about a minute.
action: Connect a source
```

Never "No data" alone. It tells the user nothing and looks like a bug.

### Errors

A plain sentence saying what happened, then what to do. Never a code, never a stack
trace, never "An error occurred".

```text
weak:    Error: ECONNREFUSED
weak:    Something went wrong!
better:  We could not reach the pricing service. Try again in a moment.
```

If a retry is possible, the retry button goes next to the sentence.

### Loading

Under two seconds, say nothing and show a skeleton. Over two seconds, say what is
happening, because a labeled wait feels shorter than an unlabeled one and it converts
dead air into evidence that work is being done.

```text
Reading 240 filings
Waiting for the transaction to confirm
```

### Success

Past tense, naming what happened. Not "Success!".

```text
Payment sent. It should arrive within a minute.
Review complete. 3 items need a human.
```

## Seed data is copy

The most underrated strings in the project. Judges read your fake data closely, because
it is the fastest way to tell whether a team understood the problem they claim to solve.

```text
weak:    Test User 1,  asdf,  Item 3,  lorem ipsum,  foo@bar.com
better:  Riverside Elementary HVAC retrofit,  Northgate Transit procurement review
```

Plausible seed data says you thought about the domain. Placeholder seed data says you
did not, and no visual polish recovers from it. `assets/seed.ts` already follows this;
keep it that way when you add rows.

## One word per concept

Pick one noun for your core object and use it everywhere: the UI, the README, the pitch,
the API routes, the commit messages. A product that calls the same thing a task, a job,
a run and a request in four places reads as four people who never spoke.

```bash
grep -rniEo "\btask\b|\bjob\b|\brun\b|\brequest\b" src/ | sort | uniq -c | sort -rn | head
```

If the counts are spread evenly across synonyms, pick the dominant one and align the
rest. Set it as `copy.product_noun` in CONFIG so it stays fixed.

## Length

Every string competes with the screen for the judge's attention:

| Element | Budget |
|---|---|
| Page title | 1 to 3 words |
| Description line | One sentence, under 90 characters |
| Button | 1 to 3 words |
| Empty state body | One sentence, two at most |
| Error | One sentence, plus the action |
| Toast | Under 60 characters |

When a string does not fit, the answer is almost never a smaller font. It is a shorter
sentence.

## Before the demo

```bash
grep -rn $'\xe2\x80\x94' src/ --include='*.tsx'                    # em dashes
grep -rniE "seamless|effortless|unlock the|empower|one.stop" src/  # generated copy
grep -rn "lorem\|asdf\|Test User\|foo@bar\|TODO" src/              # placeholder text
grep -rn "Something went wrong\|An error occurred" src/            # useless errors
```

Then read every visible string out loud, in order, as though presenting. The sentence
you stumble on is the one to rewrite.
