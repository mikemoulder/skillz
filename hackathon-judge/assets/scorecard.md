# Judge scorecard - [PROJECT]

<!--
The whole verdict fits on one screen. Depth goes in the appendix below the line,
and most of the time nobody reads it, which is correct.

Reviewed: [date, hours before deadline]   Depth: TRIAGE | FULL
Rubric:   official | inferred | generic   <- say which. a generic score on an
                                             event with published criteria misleads
-->

## Panel

```text
PANEL              score  conf    note
Product              _._  ___     
Technical            _._  ___     
Sponsor              _._  ___     [Decorative|Integrated|Core|Transformative]
Demo                 _._  ___     
                    ----
Consensus            _._          [Weak|Competitive|Strong|Exceptional]
```

**Disagreement:** [the spread that carries information, and what it means. e.g.
"Technical 8 vs Product 5: built well, aimed badly. Fix the framing, not the code."]

**Readiness:** NOT READY | FUNCTIONALLY READY | JUDGE READY | WINNING READY

<!-- Readiness is not a function of score. WINNING READY requires surviving the
     hostile pass with no serious finding outstanding. -->

## Requirements

| Requirement | Mandatory | Status | Evidence | Severity |
|---|---|---|---|---|
| | Yes | PASS / PARTIAL / FAIL / UNKNOWN | `file` or URL | |

```text
_ PASS    _ PARTIAL    _ FAIL    _ UNKNOWN
```

<!-- UNKNOWN is never promoted to PASS on assumption. Most disqualifications are
     UNKNOWNs that everybody assumed were fine. -->

## If this loses, why

```text
FATAL     
SERIOUS   
MODERATE  
MINOR     
```

<!-- Each with the evidence. Not "the demo may be fragile" but "the demo calls the
     live LLM at 0:38 with no fixture; on venue wifi that is 20 seconds of silence." -->

## Why this wins

**Defensible advantage:** [the one thing a competing team could not copy by Sunday]

<!-- If there is not one, that is the most important finding in this review and it
     belongs at the top of the section above. -->

1. 
2. 

## Fixes

```text
Hours remaining: __        Fix budget: __ (half; the rest is rehearsal + submission)

FIXING
  P0  [what]                              _._h   [why a judge cares]
  P1  [what]                              _._h   
  P2  [what]                              _._h   
                                    total _._h

NOT FIXING (decided, do not revisit)
  [what]                     [why it does not earn the hours]
```

## The question you cannot answer

**They will ask:** [the hardest one, generated from this specific project]

**Current answer:** [what the team would say today, honestly]

**Better answer:** [what it should be, and what needs to be true for that]

<!-- Every project has one. Finding it is the most valuable output of the review. -->

---

<!-- ── appendix, only if asked ─────────────────────────────────────────── -->

## Not checked

<!-- State the boundary. A clean review does not mean these passed. -->

```text
[ ] Demo on venue wifi / projector
[ ] Latency and feel under real conditions
[ ] The video: exists, under the limit, plays logged out
[ ] Console errors on load
[ ] Whether the sponsor integration is GOOD, not just present
[ ] The field: whether other teams built this
```

## Per-lens detail

### Product _._
**Evidence:** 
**Biggest concern:** 
**Cannot answer:** 

### Technical _._
**Evidence:** 
**Biggest concern:** 
**Cannot answer:** 

### Sponsor _._ | [rung]
**Evidence:** [import path, call site, and whether it is on the demo path]
**Remove the SDK. What breaks:** 
**What surprised you about their API:** [no answer means rung 2 at best]

### Demo _._
**At 0:10 the judge sees:** 
**The aha lands at:** [time it, do not estimate]
**Fallback:** [recording exists? rehearsed?]

## Claim gap

| README or form says | The code does | Severity |
|---|---|---|
| | | |
