# Patent case study figures

Source: https://github.com/Anusha19011901/Hybrid-Fuzzy-Membership-Function (figures/portfolio/), converted to WebP at max width 1400 px for this site.

Original captions follow.

Web-friendly copies (max width 1600 px) of the key figures. Regenerate with `scripts/phase4_membership.py`, `phase5_fuzzy_inference.py` and `phase6_final.py`, then `python scripts/make_portfolio_figures.py`.

- `01-membership-functions.webp`: Hybrid membership functions (max of trapezoid and Gaussian) for the four continuous attributes, fitted on training data in clinical units.
- `02-rule-base.webp`: The learned rule base: 31 single-antecedent rules with their class consequents and support.
- `03-patient-explanation.webp`: One patient explained end to end: fired terms, per-attribute contributions, combined scores, output sets, centroid and decision.
- `04-test-ci-comparison.webp`: Held-out test macro F1 and accuracy with bootstrap 95% CIs for every model; diamonds are 5-fold CV means.
- `05-per-hospital.webp`: Per-hospital diagnostic (out-of-fold macro F1) for every model; the hospital is never a feature.
