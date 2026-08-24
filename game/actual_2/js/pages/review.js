/**
 * js/pages/review.js
 * Scripted demo for the Review page.
 * Requires: css/pages.css, js/chat-helpers.js
 */
(function () {
  BcpChat.init([
    {
      user: "Run a security review on my pull request. It adds a new file upload endpoint to our API.",
      bob:  "Running security scan on the pull request...\n\n🔴 CRITICAL — Path Traversal (CWE-22)\n  File: src/api/upload.js, line 34\n  Code: const dest = './uploads/' + req.body.filename;\n  Risk: An attacker can pass '../../../etc/passwd' as filename and overwrite system files.\n  Fix: Use path.basename() to strip directory components:\n       const dest = path.join('./uploads', path.basename(req.body.filename));\n\n🟡 HIGH — Missing File Type Validation (CWE-434)\n  File: src/api/upload.js, line 41\n  Risk: No MIME type or extension check — allows upload of .php, .sh, or .exe files.\n  Fix: Allowlist accepted MIME types: ['image/jpeg', 'image/png', 'application/pdf']\n\n🟢 MEDIUM — No File Size Limit\n  Risk: Large uploads can exhaust disk space (DoS).\n  Fix: Add multer limit: { fileSize: 10 * 1024 * 1024 } (10 MB cap)\n\n2 critical issues must be resolved before merge."
    },
    {
      user: "Generate the fixed version of the upload endpoint with all three issues resolved.",
      bob:  "Here's the hardened upload endpoint:\n\n```javascript\nconst path    = require('path');\nconst multer  = require('multer');\nconst crypto  = require('crypto');\n\nconst ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'application/pdf']);\n\nconst storage = multer.diskStorage({\n  destination: './uploads',\n  filename: (_req, _file, cb) => {\n    // Randomise filename — prevents enumeration & overwrite attacks\n    cb(null, crypto.randomBytes(16).toString('hex'));\n  }\n});\n\nconst upload = multer({\n  storage,\n  limits: { fileSize: 10 * 1024 * 1024 },   // 10 MB cap\n  fileFilter: (_req, file, cb) => {\n    if (ALLOWED_TYPES.has(file.mimetype)) {\n      cb(null, true);\n    } else {\n      cb(new Error('Invalid file type'), false);\n    }\n  }\n});\n\napp.post('/upload', upload.single('file'), (req, res) => {\n  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });\n  res.json({ message: 'Upload successful', id: req.file.filename });\n});\n```\n\n✅ All three issues resolved:\n• Path traversal eliminated — random hex filename, no user input in path\n• MIME type allowlist enforced by multer fileFilter\n• 10 MB size limit enforced by multer limits"
    },
    {
      user: "What other security checks should I add before deploying this to production?",
      bob:  "Great question — here's the production hardening checklist for file uploads:\n\n🔐 Authentication & Authorisation\n  • Ensure the endpoint requires a valid JWT — unauthenticated uploads are a common attack vector\n  • Scope uploads to the authenticated user's storage bucket\n\n🗂️ Storage\n  • Store uploads outside the web root (not in /public) — files there are directly accessible via URL\n  • Use object storage (IBM Cloud Object Storage, S3) instead of local disk — easier to scan and scale\n\n🦠 Malware Scanning\n  • Stream uploaded files through ClamAV or a cloud AV API before saving permanently\n  • Quarantine suspicious files rather than deleting immediately (for forensics)\n\n📋 Audit Logging\n  • Log: who uploaded, timestamp, original filename (hashed), stored filename, MIME type, file size\n  • Never log file contents\n\n🚦 Rate Limiting\n  • Apply a per-user rate limit (e.g. 20 uploads/minute) to prevent abuse\n  • Use express-rate-limit or an API gateway rule\n\n✅ When all five areas are covered, the endpoint is production-ready."
    }
  ], 'review demo');
})();
