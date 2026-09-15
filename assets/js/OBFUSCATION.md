# Build-Level Obfuscation Guide

## Purpose
This directory supports automated obfuscation of frontend assets before deployment to GitHub Pages.

## Files
- `protect.js` — Readable protection script (source of truth)
- `protect.min.js` — Minified/obfuscated version for production use

## Recommended Build Pipeline
Use one of the following tools to automate obfuscation:

### 1. javascript-obfuscator (Recommended)
```bash
npm install --save-dev javascript-obfuscator
npx javascript-obfuscator assets/js/protect.js --output assets/js/protect.min.js \
  --compact true \
  --control-flow-flattening true \
  --control-flow-flattening-threshold 0.75 \
  --dead-code-injection true \
  --dead-code-injection-threshold 0.4 \
  --identifier-names-generator hexadecimal \
  --rename-globals true \
  --rotate-string-array true \
  --string-array true \
  --string-array-encoding base64 \
  --self-defending true
```

### 2. terser (Minification only)
```bash
npx terser assets/js/protect.js -o assets/js/protect.min.js -c -m
```

### 3. Obfuscator IO (Online)
Upload `protect.js` to [obfuscator.io](https://obfuscator.io) and download the output.

## Integration
Update HTML references to use `protect.min.js` in production:
```html
<script src="assets/js/protect.min.js"></script>
```

## ⚠️ Limitations
- Client-side obfuscation can be reversed by determined attackers.
- GitHub Pages serves static files — anyone can fetch raw assets via `curl` or `wget`.
- Use this layer alongside legal protections (LICENSE/COPYRIGHT.md) and server-side access controls where applicable.
