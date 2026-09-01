# Spike log

<!--
  Fifteen minutes per technology, in a scratch directory, following the official
  quickstart with nothing changed.

  Documentation says what a product should do. This says what it does.

  Write it while it is fresh. A spike you did not record is a spike somebody
  repeats tomorrow, and the detail in "what the docs did not say" is the one that
  proves depth to a sponsor judge later. It cannot be reconstructed.
-->

## [Technology] · [date] · [who]

**Version:** [package@version, or API version. what you actually installed]
**Docs read:** [URL, and which version selector was set]

### Can you get a key right now?

```text
[ ] self-serve, worked immediately
[ ] self-serve, but required [a form / an email confirmation / a wallet]
[ ] needed approval. Took [how long] / still waiting
[ ] issued at the event, cannot be self-served
```

<!-- The last box is a real constraint. It means nobody outside the team can run
     the repo, which the README has to disclose. -->

### Did the quickstart run?

```bash
# the commands you actually ran, verbatim
```

```text
[ ] ran unmodified
[ ] ran after fixing: [what]
[ ] did not run: [what stopped it]
```

**Runtime:** [node version, OS, package manager. this is why it worked or did not]

### What does a real response look like?

```json
// paste an actual response, trimmed. not the one from the docs.
// the difference between these two is the point of this exercise.
```

**Latency:** [measured, warm and cold. matters for the demo]

### What did the docs not say?

<!-- THE most valuable line in this file.

     This is the detail that becomes a sponsor-track story: the rate limit that is
     not published, the timeout that closes idle connections, the response shape
     that changed, the parameter that is required but marked optional.

     It cannot be faked and it is the answer to "what surprised you about our SDK",
     which is the question that separates rung 2 from rung 4. -->

```text
```

### Verdict

```text
[ ] usable, no reservations
[ ] usable with a caveat: [what]
[ ] risky: [why]. Prototype the risky call before committing to it
[ ] not available to us: [why]. The architecture changes NOW, while it is cheap
```

**Feasibility multiplier:** [1.5x done it before / 2x done something close /
3x read the docs / 4x new SDK, docs unread]

<!-- Feeds hackathon-ideation's feasibility scoring and hackathon-architecture's
     build estimates. -->

---

<!-- Repeat per technology. Two or three total, never more. -->

## Carried forward

```text
This spike IS hackathon-architecture's hour-one risk spike. Do not run it twice.

If any verdict above is "not available to us", that changes the idea, not just the
architecture. Say so before ideation starts.
```
