/**
 * js/pages/deploy.js
 * Scripted demo for the Deploy page.
 * Requires: css/pages.css, js/chat-helpers.js
 */
(function () {
  BcpChat.init([
    {
      user: "Generate a production-ready Dockerfile for our Node.js Express API. It should be secure and minimal.",
      bob:  "Here's a production-ready Dockerfile using a Red Hat UBI minimal base image:\n\n```dockerfile\nFROM registry.redhat.io/ubi9/nodejs-20-minimal:latest\n\n# Switch to non-root user (UID 1001 is pre-created in UBI)\nUSER 1001\n\nWORKDIR /app\n\n# Install dependencies first (layer cache-friendly)\nCOPY --chown=1001:1001 package*.json ./\nRUN npm ci --omit=dev\n\n# Copy application source\nCOPY --chown=1001:1001 . .\n\n# Expose port (documentation only — not a firewall rule)\nEXPOSE 3000\n\nCMD [\"node\", \"src/server.js\"]\n```\n\n✅ Security highlights:\n• UBI 9 base — Red Hat-signed, regularly patched, FIPS-compatible\n• Non-root USER 1001 — no privilege escalation if container is compromised\n• npm ci --omit=dev — production deps only, reproducible install\n• Layer order optimised — npm install cached unless package.json changes"
    },
    {
      user: "Now generate a GitHub Actions CI/CD pipeline that builds, tests, and pushes the image to IBM Cloud Container Registry.",
      bob:  "Here's the GitHub Actions workflow:\n\n```yaml\nname: Build & Deploy\n\non:\n  push:\n    branches: [main]\n\nenv:\n  REGISTRY: us.icr.io\n  NAMESPACE: my-org\n  IMAGE:     api-service\n\njobs:\n  build-test-push:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Set up Node 20\n        uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'\n\n      - name: Install & test\n        run: |\n          npm ci\n          npm test\n\n      - name: Log in to IBM Cloud Container Registry\n        uses: docker/login-action@v3\n        with:\n          registry: ${{ env.REGISTRY }}\n          username: iamapikey\n          password: ${{ secrets.ICR_API_KEY }}\n\n      - name: Build & push image\n        uses: docker/build-push-action@v5\n        with:\n          context: .\n          push: true\n          tags: |\n            ${{ env.REGISTRY }}/${{ env.NAMESPACE }}/${{ env.IMAGE }}:latest\n            ${{ env.REGISTRY }}/${{ env.NAMESPACE }}/${{ env.IMAGE }}:${{ github.sha }}\n```\n\n🔑 Add ICR_API_KEY as a GitHub secret (Settings → Secrets → Actions)."
    },
    {
      user: "The pipeline just failed at the test step with 'Cannot find module ./db'. How do I debug this?",
      bob:  "That error means Node can't resolve the ./db import at test time. Here are the most common causes and how to fix each:\n\n1️⃣ Missing test environment variable\n   The db module probably reads a DATABASE_URL env var at import time. In CI there's no .env file.\n   Fix: Add a step before npm test:\n   ```yaml\n   - name: Set test env\n     run: echo \"DATABASE_URL=postgres://localhost/test\" >> $GITHUB_ENV\n   ```\n\n2️⃣ Module path case mismatch\n   Linux (CI) is case-sensitive; macOS (local) is not.\n   If the file is DB.js but the import is ./db, it works locally but fails on Linux.\n   Fix: Rename the file to lowercase db.js.\n\n3️⃣ Missing service container\n   If db.js tries to open a real connection at import, it crashes because no database is running.\n   Fix: Add a Postgres service container to the job:\n   ```yaml\n   services:\n     postgres:\n       image: postgres:16\n       env:\n         POSTGRES_PASSWORD: test\n       ports: ['5432:5432']\n   ```\n\n🔍 Quick diagnosis: add run: cat src/db.js to the workflow to confirm the file exists in CI before the test step."
    }
  ], 'deploy demo');
})();
