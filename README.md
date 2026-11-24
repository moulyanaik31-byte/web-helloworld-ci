name: Web CI and Security Pipeline

on:
  push:
    branches: ["master"]
  pull_request:
    branches: ["master"]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  code-quality:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: HTML Validation
        run: npx --yes htmlhint@1.1.4 index.html

      - name: CSS Validation
        run: npx --yes stylelint@16 style.css

      - name: JavaScript Syntax Validation
        run: node --check script.js

      - name: JavaScript Code Quality
        run: npx --yes eslint@9 script.js

  testing:
    runs-on: ubuntu-latest
    needs: code-quality

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Run Functional Tests
        run: node --test script.test.js

      - name: Build Status
        run: echo "BUILD AND TEST SUCCESS"

  security-check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Trivy Filesystem Scan
        uses: aquasecurity/trivy-action@v0.36.0
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'json'
          output: 'trivy-report.json'
          severity: 'HIGH,CRITICAL'
          scanners: 'vuln,misconfig,secret'
          exit-code: '1'

      - name: Upload Trivy Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: tr
