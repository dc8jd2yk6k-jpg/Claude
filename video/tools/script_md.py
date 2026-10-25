"""Writes script/script.md: the narration with timestamps and numbered sources."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = {
    1: ("Reuters via KSL — Anthropic logged net loss of over $80 billion in H1 2026 (draft S-1), Oct 20 2026", "https://www.ksl.com/article/51638817/anthropic-recorded-net-loss-of-over-80-billion-in-first-half-of-this-year-wsj-reports"),
    2: ("WSJ via Yahoo Finance — revenue hits $16.3 billion as preliminary S-1 outlines IPO risks", "https://finance.yahoo.com/technology/ai/articles/anthropic-revenue-hits-16-3-201707100.html"),
    3: ("Fortune — leaked S-1 income statement, Sep 29 2026", "https://fortune.com/2026/09/29/anthropic-ipo-s-1-prospectus-income-statement/"),
    4: ("KuCoin / Angel Investors Network — $20.28B cash, cash equivalents & short-term investments at Dec 31 2025", "https://www.kucoin.com/blog/anthropic-ipo-prospectus-growth-and-costs"),
    5: ("VentureBeat — Amodei: planned for 10x, saw 80x; ~$9B run-rate at end of 2025", "https://venturebeat.com/technology/anthropic-says-it-hit-a-30-billion-revenue-run-rate-after-crazy-80x-growth"),
    6: ("CNBC / Bloomberg — run-rate $65B at end of July 2026; OpenAI ~$40B", "https://www.cnbc.com/2026/08/17/anthropic-says-annualized-revenue-climbed-to-65-billion-in-july.html"),
    7: ("SaaStr — $14B ARR, up from $1B fourteen months earlier", "https://saastr.com/anthropic-just-hit-14-billion-in-arr-up-from-1-billion-just-14-months-ago"),
    8: ("Orrick — $65B Series H at $965B post-money (May 2026)", "https://www.orrick.com/en/News/2026/05/Anthropic-Raises-65B-Series-H-at-965B-Post-Money-Valuation"),
    9: ("Menlo Ventures enterprise survey, late 2025 (Menlo is an Anthropic investor), via ValueAddVC", "https://valueaddvc.com/blog/anthropic-market-share-2026-40-percent-enterprise-llm-spend-openai"),
    10: ("Amazon 10-Q (Q2 2026), as reported — notes $97.9B + preferred $92.5B", "https://primexbt.com/news/amazons-13-billion-anthropic-stake-is-now-valued-at-190-4-billion/"),
    11: ("Anthropic — Series E at $61.5B post-money (Mar 2025)", "https://www.anthropic.com/news/anthropic-raises-series-e-at-usd61-5b-post-money-valuation"),
    12: ("Axios — $30B at $380B valuation (Feb 2026)", "https://axios.com/2026/02/12/anthropic-raises-30b-at-380b-valuation"),
    13: ("Reuters via Yahoo Finance — at least $518B of commitments; ~80% non-cancellable", "https://finance.yahoo.com/technology/ai/articles/anthropic-1-518-billion-commitment-165731037.html"),
    14: ("Dealroom — draft S-1: Nvidia GPUs via neoclouds; up to $750B compute bill", "https://dealroom.co/news/164610-anthropics-draft-s-1-reveals-16-3b-revenue-80-7b-loss-and-up-to-750b-com/"),
    15: ("FourWeekMBA — filing says Google, AWS and Microsoft see Anthropic as a rival", "https://fourweekmba.com/ai-anthropic-says-google-aws-and-microsoft-see-it-as-a-rival/"),
    16: ("Inc. — a quarter of revenue from two customers (Reuters reports ~20%)", "https://www.inc.com/moses-jeanfrancois/quarter-of-anthropic-revenue-come-from-2-customers-experts-say-real-test-comes-next/91411817"),
    17: ("The Next Web — New Constructs values Anthropic at ~$144B", "https://thenextweb.com/news/anthropic-ipo-valuation-new-constructs-144bn"),
    18: ("PitchBook via Morningstar — Amazon's note marks; growth vs a $2T valuation", "https://www.morningstar.com/stocks/anthropics-leaked-financials-reflect-fast-growth-not-2-trillion-valuation"),
}
CITE = {"h1": [1], "h2": [6], "s2": [7, 6], "s3": [5], "s4": [6], "s5": [9], "s6": [10], "s7": [11], "s8": [8, 6],
        "l2": [2], "l3": [1], "l4": [4], "p1": [1], "p6": [12, 8], "p8": [10, 18], "p9": [1], "b2": [1], "b3": [13],
        "b4": [13, 14], "b5": [13], "b6": [4], "b7": [12, 8], "b8": [15], "b9": [16], "v1": [17, 8, 6], "v6": [1]}
NAMES = {"hook": "Hook", "strength": "1 · How strong is it?", "leak": "2 · The leak",
         "phantom": "3 · Twist #1: the phantom loss", "bill": "4 · Twist #2: the real bill",
         "verdict": "5 · The verdict", "end": "End screen"}

if __name__ == "__main__":
    nar = json.loads((ROOT / "script" / "narration.json").read_text())
    tl = json.loads((ROOT / "build" / "timeline.json").read_text())
    ts = lambda t: f"{int(t // 60)}:{t % 60:05.2f}"  # noqa: E731
    out = ["# The $80 Billion Paradox — narration script (v2)", "",
           "Independent explainer. Figures come from press reports of Anthropic’s **draft, unaudited** S-1 and "
           "related coverage (Sep–Oct 2026) and may change. Not affiliated with Anthropic. Not investment advice.", "",
           "Timestamps come from `build/timeline.json`. Bracketed numbers point to the sources below.", ""]
    for l in nar["lines"]:
        if "section" in l:
            out += ["", f"## {NAMES[l['section']]}", ""]
        refs = "".join(f"[{n}]" for n in CITE.get(l["id"], []))
        out.append(f"- `{ts(tl['lines'][l['id']]['start'])}` {l['text']} {refs}".rstrip())
    out += ["", "## Sources", ""] + [f"{k}. [{n}]({u})" for k, (n, u) in SRC.items()]
    out += ["", "### Where reports disagree", "",
            "- Two-customer concentration: ~20% (Reuters) vs ~25% (Inc.) — the video says “a fifth to a quarter”.",
            "- Total compute commitments: ≥$518B (Reuters) vs ~$450B in cloud agreements and up to $750B including deals under negotiation (WSJ). The $86B Nvidia/neocloud figure comes from a separate report, so components may not sum exactly.",
            "- Adjusted operating income is company-defined; run-rates are company-reported annualizations and Anthropic and OpenAI may calculate them differently.",
            "- The 2026 funding figure ($95B) is the headline size of two announced rounds ($30B in February, $65B in May, which included $15B previously committed by hyperscalers); it is not a cash balance."]
    (ROOT / "script" / "script.md").write_text("\n".join(out) + "\n")
    print("script/script.md written")
