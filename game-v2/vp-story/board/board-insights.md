# Board Insights — Q3 Vendor Analysis
**Prepared for:** Alex Chen, VP / Director  
**Date:** 25 August 2026  
**Proposals reviewed:** 3 (proposal-cloud.md · proposal-ai.csv · proposal-security.docx)

---

## Singular Recommendation

> **Approve Security Uplift (Proposal C) now. Sequence Proposals A and B after.**

This is not a trade-off between equals — it is a prerequisite decision. Without the security baseline Proposal C delivers, both Proposals A and B carry compliance exposure that would likely surface as a material finding in the next external audit.

---

## Proposal Summary

| Proposal | Vendor | Total Cost | Timeline | Annual Ongoing | Score |
|---|---|---|---|---|---|
| ☁ Cloud Migration | Apex Cloud Solutions | $4.2M | 18 months | $380K/yr infra | 71 / 100 |
| 🤖 AI Platform | Nexus AI Technologies | $2.8M + $600K/yr | 12 months MVP | $600K/yr licence | 60 / 100 |
| 🔐 Security Uplift | ShieldTech Cybersecurity | $1.4M fixed-price | 9 months | $210K/yr support | **93 / 100** |

---

## Cross-Proposal Scorecard

| Criterion (weight) | ☁ Cloud | 🤖 AI | 🔐 Security |
|---|---|---|---|
| Strategic alignment (25%) | 22 / 25 | 16 / 25 | **24 / 25** |
| Financial risk (20%) | 11 / 20 | 9 / 20 | **19 / 20** |
| Delivery confidence (20%) | 12 / 20 | 11 / 20 | **18 / 20** |
| Regulatory compliance (20%) | 13 / 20 | 14 / 20 | **20 / 20** |
| Scalability & longevity (15%) | 13 / 15 | 10 / 15 | 12 / 15 |
| **Total** | 71 / 100 | 60 / 100 | **93 / 100** |

---

## Risk Analysis

**☁ Cloud Migration — Strategic Fit: High · Risk: Medium-High**

Strong alignment with the 3-year infrastructure modernisation goal. 18-month runway overlaps two product release cycles — resource contention risk. Vendor has no local data-residency attestation — potential compliance blocker. Single-hyperscaler dependency (AWS) loses negotiating leverage post-migration.

**🤖 AI Platform — Strategic Fit: Medium · Risk: High**

Projected Year-3 savings of $2.3M but 3-year net benefit is only $900K once $1.8M implementation and licence costs are netted off. ROI relies entirely on data quality assumptions your current estate does not yet meet. $600K/yr perpetual licence is a lock-in cliff — switching costs after Year 2 estimated at $1.8M. Reference customers are retail only; financial-services context unproven.

**🔐 Security Uplift — Strategic Fit: Very High · Risk: Low**

Directly addresses the two Critical findings from Q2 penetration test. Fastest time-to-value at 9 months. Fixed-price contract eliminates overrun exposure. ISO 27001 + SOC 2 Type II — required for your regulatory obligations. This is a prerequisite: both Cloud Migration and AI Platform depend on the security baseline it establishes.

---

## Why Not AI Platform First?

The $600K/yr perpetual licence is a structural commitment you should only enter after the data quality programme is confirmed. ROI assumptions are not yet verifiable against your data estate. Recommend a 6-week assessment before any approval.

## Why Not Cloud Migration First?

At $4.2M and 18 months, approving it before the security baseline is established means migrating a non-compliant estate into a hyperscaler — compounding audit exposure. Approve in Q1 2027 once ShieldTech delivers the Month 3 milestone report.

---

## Three Board Motions

**M1 — Approve Proposal C (Security Uplift, $1.4M, fixed-price, 9 months)**  
CFO sign-off within existing budget authority. Instruct CTO to commence Phase 1 within 30 days. No further committee required.

**M2 — Note Proposals A and B — defer pending security baseline**  
Instruct CTO to present a sequencing plan for Proposal A in Q4 2026, contingent on Proposal C Month 3 milestone report confirming compliance readiness.

**M3 — Commission 6-week data quality assessment for Proposal B ROI validation**  
Proposal B ROI assumes a clean, structured data estate. This assumption is currently unverified. Results to be presented at next board cycle before any licence commitment.

---

## Security Uplift — Delivery Phases

| Phase | Budget | % | Months | Scope |
|---|---|---|---|---|
| Phase 1 — Remediation | $420K | 30% | 1–3 | MFA, access control, pentest fixes |
| Phase 2 — Hardening | $560K | 40% | 4–6 | Network segmentation, EDR, SIEM |
| Phase 3 — Governance & Cert. | $420K | 30% | 7–9 | ISO 27001, SOC 2 Type II, training |

---

*The decision is yours. I made sure nothing important was missing when you made it.*
