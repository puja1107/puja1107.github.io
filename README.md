# Puja Kumari Portfolio

Personal portfolio for Puja Kumari, a GCP Data Engineer and Data Engineering Specialist.

## Overview

The site presents:

- Cloud data engineering experience and professional certifications
- GCP, BigQuery, Dataflow, Cloud Composer, Python, SQL, and analytics skills
- Selected telecom data platform, quality, security, and Qlik projects
- A responsive contact workflow with masked contact details

## Structure

```text
index.html                  Main portfolio page
assets/css/style.css        Shared visual system and desktop layout
assets/css/mobile.css       Responsive rules through 320px viewport width
assets/css/sections.css     Section scroll offsets
assets/js/main.js           Navigation, theme, copy, animation, and form behavior
assets/images/              Portfolio imagery
LICENSE                     All Rights Reserved license
COPYRIGHT.md                Copyright and reuse notice
```

## Run Locally

This is a static site. Open `index.html` in a browser, or serve the repository with any static web server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Behavior Notes

- Hero and navigation anchor buttons use one smooth-scroll controller and close the mobile menu after navigation.
- The email address is masked in HTML and is assembled only when a user activates a copy action or submits the contact form.
- Phone numbers are not published on the site; phone contact is available on request.
- Copy and keyboard/context-menu deterrents are implemented client-side and should not be treated as security controls.
- JavaScript and CSS source maps are not generated or published.

## Rights

All rights are reserved. See [LICENSE](LICENSE) and [COPYRIGHT.md](COPYRIGHT.md) before reusing any content or code.
