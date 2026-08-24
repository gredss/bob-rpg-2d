/**
 * role-scenarios.js — Role-mode game content
 * Four roles sourced entirely from script.md.
 *
 * Characters (script-mode keys — distinct from team-scenario keys):
 *   priya  → Priya Nair,  Data Analyst   (assets: data-scientist/)
 *   sam    → Sam Rivera,  Developer      (assets: backend-dev/)
 *   taylor → Taylor Kim,  Head IT        (assets: devops-engineer/)
 *   alex   → Alex Chen,   VP / Director  (assets: product-manager/)
 *   bob    → Bob,         AI Teammate    (assets: bob/)
 *
 * Each scene may carry an `id: { field: 'Indonesian text' }` block for lang=id.
 * Each option may carry an `id_text: { label, meta, bobResponse, bobFollowUp, outcome }` block.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🔵 DATA ANALYST — Priya Nair  ×  Taylor Kim
//    IBM watsonx.data integration
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_ANALYST = {
  id: 'analyst',
  workstation: { icon: '', label: 'watsonx.data Console', label_id: 'Konsol watsonx.data' },
  brief: '40 columns of raw data. One integration job. Deadline is tomorrow morning.',
  scenes: [

    { type: 'chapter', phase: 'analyst', title: 'YOUR WORKDAY', subtitle: 'Data Analyst',
      id: { title: 'HARI KERJAMU', subtitle: 'Analis Data' } },

    // ── Fase 1 — Problem ─────────────────────────────────────────────────────

    { type: 'dialogue', char: 'narrator',
      text: 'Meja penuh monitor. Tabel PostgreSQL nyala di layar.',
      id: { text: 'Meja penuh monitor. Tabel PostgreSQL nyala di layar.' } },

    { type: 'dialogue', char: 'priya', expr: 'confused',
      text: 'Ini gimana caranya... raw data-nya ada 40 kolom, belum di-clean, terus harus bikin integration job di watsonx.data. Mana deadline-nya besok pagi.',
      id: { text: 'Ini gimana caranya... raw data-nya ada 40 kolom, belum di-clean, terus harus bikin integration job di watsonx.data. Mana deadline-nya besok pagi.' } },

    { type: 'dialogue', char: 'taylor', expr: 'lecturing',
      text: 'Priya, kamu pernah coba pakai Bob?',
      id: { text: 'Priya, kamu pernah coba pakai Bob?' } },

    { type: 'dialogue', char: 'priya', expr: 'confused',
      text: 'Bob? Yang AI itu? Emang bisa bantu urusan pipeline?',
      id: { text: 'Bob? Yang AI itu? Emang bisa bantu urusan pipeline?' } },

    { type: 'dialogue', char: 'taylor', expr: 'lecturing',
      text: 'Bukan cuma bisa — dia ngerti dari PostgreSQL sampai watsonx. Sini, saya tunjukin dulu fundamentalnya.',
      id: { text: 'Bukan cuma bisa — dia ngerti dari PostgreSQL sampai watsonx. Sini, saya tunjukin dulu fundamentalnya.' } },

    // ── Fase 2 — Laptop / Hands-on ───────────────────────────────────────────

    { type: 'task', char: 'priya', expr: 'confused', phase: 'analyst',
      problem: 'Raw data: 40 kolom di PostgreSQL, belum di-clean, belum ada integration job — deadline besok pagi. Taylor menawarkan untuk tunjukkan cara Bob bisa bantu. Mulai dari mana?',
      id: { problem: 'Raw data: 40 kolom di PostgreSQL, belum di-clean, belum ada integration job — deadline besok pagi. Taylor menawarkan untuk tunjukkan cara Bob bisa bantu. Mulai dari mana?' },
      options: [
        { id: 'an-1-bob', type: 'bob', icon: '',
          label: 'Ask Bob to profile the 40-column dataset and generate a cleaning plan',
          meta: '~40 sec saved', timeCost: 10, manualCost: 50,
          deltas: { quality: 14, satisfaction: 10 },
          bobResponse: 'Dataset profile complete — PostgreSQL source detected.\n\nColumn audit (40 cols):\n• 12 columns: >30% null values → recommend median/mode imputation or drop\n• 6 columns: inconsistent data types (e.g. dates stored as VARCHAR, booleans as INT)\n• 4 columns: duplicate semantic meaning (e.g. `cust_id` and `customer_id`)\n• 18 columns: clean and ready\n\nCleaning plan:\n1. Drop 3 near-empty columns (>80% null, low signal)\n2. Normalise date columns to ISO 8601 via CAST in SQL\n3. Deduplicate semantic twins — keep canonical column names\n4. Impute remaining nulls with category median\n\nEstimated output: 37 clean columns, ready for watsonx.data ingestion.',
          bobFollowUp: 'Apply the full cleaning plan and prepare for ingestion',
          followUpDeltas: { quality: 8, satisfaction: 6 },
          outcome: 'Dataset cleaned. 37 structured columns ready. watsonx.data ingestion can begin. ✓',
          id_text: {
            label: 'Minta Bob membuat profil 40 kolom dataset dan rencana pembersihan',
            meta: '~40 detik hemat',
            bobResponse: 'Profil dataset selesai — sumber PostgreSQL terdeteksi.\n\nAudit kolom (40 kolom):\n• 12 kolom: nilai null >30% → rekomendasikan imputasi median/modus atau hapus\n• 6 kolom: tipe data tidak konsisten (misal tanggal sebagai VARCHAR, boolean sebagai INT)\n• 4 kolom: makna semantik duplikat (misal `cust_id` dan `customer_id`)\n• 18 kolom: bersih dan siap\n\nRencana pembersihan:\n1. Hapus 3 kolom hampir kosong (>80% null, sinyal rendah)\n2. Normalisasi kolom tanggal ke ISO 8601 via CAST di SQL\n3. Deduplikasi kembar semantik — pertahankan nama kolom kanonik\n4. Imputasi nilai null yang tersisa dengan median kategori\n\nOutput yang diestimasi: 37 kolom bersih, siap untuk ingesti watsonx.data.',
            bobFollowUp: 'Terapkan rencana pembersihan lengkap dan siapkan untuk ingesti',
            outcome: 'Dataset dibersihkan. 37 kolom terstruktur siap. Ingesti watsonx.data dapat dimulai. ✓',
          } },
        { id: 'an-1-manual', type: 'manual', icon: '',
          label: 'Inspect all 40 columns manually in PostgreSQL',
          meta: '~50 sec', timeCost: 50, manualCost: 50,
          deltas: { quality: 5, satisfaction: 3 },
          outcome: 'Cleaned the obvious issues. Several edge cases missed. Integration job may fail later.',
          id_text: { label: 'Periksa semua 40 kolom secara manual di PostgreSQL', meta: '~50 detik', outcome: 'Masalah yang jelas sudah bersih. Beberapa kasus tepi terlewat. Integration job mungkin gagal nanti.' } },
        { id: 'an-1-skip', type: 'ignore', icon: '',
          label: 'Skip cleaning — ingest raw data directly into watsonx.data',
          meta: 'pipeline risk', timeCost: 0,
          deltas: { quality: -16, satisfaction: -12 },
          outcome: 'Ingestion failed at 3 type-mismatch columns. Job stopped. Tomorrow\'s deadline is now at risk.',
          id_text: { label: 'Lewati pembersihan — langsung ingest data mentah ke watsonx.data', meta: 'risiko pipeline', outcome: 'Ingesti gagal di 3 kolom type-mismatch. Job berhenti. Deadline besok kini terancam.' } },
      ] },

    { type: 'dialogue', char: 'taylor', expr: 'lecturing',
      text: 'Bagus. Data sudah bersih. Sekarang Bob bisa bantu kamu generate SQL query dan konfigurasi integration job-nya langsung.',
      id: { text: 'Bagus. Data sudah bersih. Sekarang Bob bisa bantu kamu generate SQL query dan konfigurasi integration job-nya langsung.' } },

    { type: 'task', char: 'priya', expr: 'listening', phase: 'analyst',
      problem: 'Data is clean. Now you need to query the data and configure the watsonx.data integration job — connect to the PostgreSQL source, define transformation rules, and schedule the pipeline run.',
      id: { problem: 'Data sudah bersih. Sekarang perlu query data dan konfigurasi integration job watsonx.data — hubungkan ke sumber PostgreSQL, tentukan aturan transformasi, dan jadwalkan pipeline run.' },
      options: [
        { id: 'an-2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to generate the SQL query and integration job configuration',
          meta: '~44 sec saved', timeCost: 11, manualCost: 55,
          deltas: { quality: 15, satisfaction: 12 },
          bobResponse: 'SQL query generated:\n\n```sql\nSELECT\n  customer_id, event_date, product_sku,\n  purchase_amount, customer_region\nFROM analytics_db.public.transactions\nWHERE event_date >= CURRENT_DATE - INTERVAL \'90 days\'\n  AND purchase_amount IS NOT NULL\nORDER BY event_date DESC;\n```\n\nIntegration job config for watsonx.data:\n• Source: PostgreSQL → `analytics_db.public.transactions`\n• Transformation: date normalisation + null imputation (as per cleaning plan)\n• Target: `wx_analytics_mart` — partitioned by `event_date`\n• Schedule: daily 02:00 UTC\n\nStatus: ready to submit.',
          bobFollowUp: 'Run query and create the integration job',
          followUpDeltas: { quality: 8, satisfaction: 10 },
          outcome: 'Job Created ✓  Query output visible. Pipeline live, running nightly at 02:00 UTC.',
          id_text: {
            label: 'Minta Bob menghasilkan SQL query dan konfigurasi integration job',
            meta: '~44 detik hemat',
            bobResponse: 'SQL query dihasilkan:\n\n```sql\nSELECT\n  customer_id, event_date, product_sku,\n  purchase_amount, customer_region\nFROM analytics_db.public.transactions\nWHERE event_date >= CURRENT_DATE - INTERVAL \'90 days\'\n  AND purchase_amount IS NOT NULL\nORDER BY event_date DESC;\n```\n\nKonfigurasi integration job untuk watsonx.data:\n• Sumber: PostgreSQL → `analytics_db.public.transactions`\n• Transformasi: normalisasi tanggal + imputasi null (sesuai rencana pembersihan)\n• Target: `wx_analytics_mart` — dipartisi berdasarkan `event_date`\n• Jadwal: harian 02:00 UTC\n\nStatus: siap dikirim.',
            bobFollowUp: 'Jalankan query dan buat integration job',
            outcome: 'Job Created ✓  Output query terlihat. Pipeline aktif, berjalan setiap malam pukul 02:00 UTC.',
          } },
        { id: 'an-2-manual', type: 'manual', icon: '',
          label: 'Write the SQL and configure the job manually in the watsonx.data UI',
          meta: '~55 sec', timeCost: 55, manualCost: 55,
          deltas: { quality: 6, satisfaction: 4 },
          outcome: 'Job configured. Missing partition key — queries will be slower but it runs.',
          id_text: { label: 'Tulis SQL dan konfigurasi job secara manual di UI watsonx.data', meta: '~55 detik', outcome: 'Job dikonfigurasi. Partition key terlewat — query akan lebih lambat tapi berjalan.' } },
        { id: 'an-2-guesswork', type: 'poor', icon: '',
          label: 'Copy a configuration from a Stack Overflow post and adapt it',
          meta: 'untested', timeCost: 20,
          deltas: { quality: -12, satisfaction: -8 },
          outcome: 'Config uses deprecated API fields. Job fails on first run with a schema validation error.',
          id_text: { label: 'Salin konfigurasi dari Stack Overflow dan adaptasi', meta: 'belum teruji', outcome: 'Config menggunakan field API yang sudah usang. Job gagal saat pertama dijalankan dengan error validasi skema.' } },
      ] },

    // ── Fase 3 — Relief ───────────────────────────────────────────────────────

    { type: 'dialogue', char: 'priya', expr: 'relief',
      text: 'Ini... selesai? 2 jam jadi 10 menit?',
      id: { text: 'Ini... selesai? 2 jam jadi 10 menit?' } },

    { type: 'dialogue', char: 'taylor', expr: 'relief',
      text: 'Itu baru dasarnya. Besok coba tanya ke Bob langsung kalau stuck.',
      id: { text: 'Itu baru dasarnya. Besok coba tanya ke Bob langsung kalau stuck.' } },

    { type: 'dialogue', char: 'priya', expr: 'relief',
      text: 'Kenapa nggak ada yang kasih tahu saya dari dulu.',
      id: { text: 'Kenapa nggak ada yang kasih tahu saya dari dulu.' } },

    { type: 'dialogue', char: 'bob',
      text: 'Clean data. Live query. Job scheduled.\n\nThat\'s a full watsonx.data integration — done in minutes, not hours. You understood the problem; I just helped you move faster.',
      id: { text: 'Data bersih. Query berjalan. Job terjadwal.\n\nItulah integrasi watsonx.data yang lengkap — selesai dalam menit, bukan jam. Kamu memahami masalahnya; saya hanya membantu kamu bergerak lebih cepat.' } },

    { type: 'end' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 🟠 DEVELOPER — Sam Rivera  ×  Taylor Kim
//    IBM watsonx.ai
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_DEVELOPER = {
  id: 'developer',
  workstation: { icon: '', label: 'watsonx.ai Studio', label_id: 'Studio watsonx.ai' },
  brief: 'Unfamiliar API. VP demo tomorrow. No time to read 200 pages of docs.',
  scenes: [

    { type: 'chapter', phase: 'developer', title: 'YOUR WORKDAY', subtitle: 'Developer',
      id: { title: 'HARI KERJAMU', subtitle: 'Developer' } },

    // ── Fase 1 — Problem ─────────────────────────────────────────────────────

    { type: 'dialogue', char: 'narrator',
      text: 'Sam stares at the watsonx.ai API docs. The page keeps scrolling.',
      id: { text: 'Sam menatap dokumentasi API watsonx.ai. Halaman terus scroll.' } },

    { type: 'dialogue', char: 'sam', expr: 'stressed',
      text: 'Ini API-nya belum pernah saya sentuh. Auth-nya beda, response schema-nya ribet, deadline demo ke VP besok.',
      id: { text: 'Ini API-nya belum pernah saya sentuh. Auth-nya beda, response schema-nya ribet, deadline demo ke VP besok.' } },

    { type: 'dialogue', char: 'taylor', expr: 'lecturing',
      text: 'Sam, udah pakai Bob belum buat integrasi ini?',
      id: { text: 'Sam, udah pakai Bob belum buat integrasi ini?' } },

    { type: 'dialogue', char: 'sam', expr: 'skeptical',
      text: 'Bob bisa bantu code?',
      id: { text: 'Bob bisa bantu code?' } },

    { type: 'dialogue', char: 'taylor', expr: 'lecturing',
      text: 'Dia bisa generate boilerplate, explain schema, bahkan debug error. Mari saya tunjukin.',
      id: { text: 'Dia bisa generate boilerplate, explain schema, bahkan debug error. Mari saya tunjukin.' } },

    // ── Fase 2 — Laptop / Hands-on ───────────────────────────────────────────

    { type: 'task', char: 'sam', expr: 'stressed', phase: 'developer',
      problem: 'The watsonx.ai API is unfamiliar — auth is different, response schema is complex, and the VP demo is tomorrow. How do you get started without wasting hours on docs?',
      id: { problem: 'API watsonx.ai belum pernah disentuh — auth-nya berbeda, response schema-nya kompleks, dan demo VP besok. Bagaimana memulai tanpa buang waktu berjam-jam baca dokumentasi?' },
      options: [
        { id: 'dev-1-bob', type: 'bob', icon: '',
          label: 'Ask Bob to generate the watsonx.ai API boilerplate and explain the auth',
          meta: '~45 sec saved', timeCost: 11, manualCost: 56,
          deltas: { quality: 15, satisfaction: 12 },
          bobResponse: 'watsonx.ai API boilerplate generated.\n\nAuth: IAM token-based. Exchange your API key once per session:\n```python\nimport requests\n\nIAM_URL = "https://iam.cloud.ibm.com/identity/token"\ntoken_resp = requests.post(IAM_URL, data={\n  "apikey": API_KEY, "grant_type": "urn:ibm:params:oauth:grant-type:apikey"\n})\ntoken = token_resp.json()["access_token"]\n```\n\nGeneration call:\n```python\nWX_URL = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation"\nheaders = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}\npayload = {"model_id": "ibm/granite-13b-instruct-v2",\n           "input": "Explain watsonx in one sentence.",\n           "parameters": {"max_new_tokens": 100}}\nresp = requests.post(WX_URL, json=payload, headers=headers)\nprint(resp.json()["results"][0]["generated_text"])\n```\n\nReady to test. Run this and check the output.',
          bobFollowUp: 'Run the test against watsonx.ai',
          followUpDeltas: { quality: 8, satisfaction: 8 },
          outcome: 'Boilerplate runs. Auth works. First API response received. ✓',
          id_text: {
            label: 'Minta Bob menghasilkan boilerplate API watsonx.ai dan menjelaskan auth',
            meta: '~45 detik hemat',
            bobResponse: 'Boilerplate API watsonx.ai dihasilkan.\n\nAuth: berbasis token IAM. Tukar API key sekali per sesi:\n```python\nimport requests\n\nIAM_URL = "https://iam.cloud.ibm.com/identity/token"\ntoken_resp = requests.post(IAM_URL, data={\n  "apikey": API_KEY, "grant_type": "urn:ibm:params:oauth:grant-type:apikey"\n})\ntoken = token_resp.json()["access_token"]\n```\n\nPanggilan generasi:\n```python\nWX_URL = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation"\nheaders = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}\npayload = {"model_id": "ibm/granite-13b-instruct-v2",\n           "input": "Jelaskan watsonx dalam satu kalimat.",\n           "parameters": {"max_new_tokens": 100}}\nresp = requests.post(WX_URL, json=payload, headers=headers)\nprint(resp.json()["results"][0]["generated_text"])\n```\n\nSiap untuk diuji. Jalankan ini dan cek hasilnya.',
            bobFollowUp: 'Jalankan test terhadap watsonx.ai',
            outcome: 'Boilerplate berjalan. Auth berhasil. Respons API pertama diterima. ✓',
          } },
        { id: 'dev-1-manual', type: 'manual', icon: '',
          label: 'Read through the official API docs and write the boilerplate manually',
          meta: '~56 sec', timeCost: 56, manualCost: 56,
          deltas: { quality: 5, satisfaction: 3 },
          outcome: 'Boilerplate written after a while. Auth still unclear — will need to revisit.',
          id_text: { label: 'Baca dokumentasi API resmi dan tulis boilerplate secara manual', meta: '~56 detik', outcome: 'Boilerplate selesai ditulis setelah beberapa saat. Auth masih belum jelas — perlu dikunjungi lagi.' } },
        { id: 'dev-1-skip', type: 'ignore', icon: '',
          label: 'Copy a random GitHub example and hope it still works',
          meta: 'outdated risk', timeCost: 5,
          deltas: { quality: -14, satisfaction: -10 },
          outcome: 'Example uses a deprecated endpoint. Auth fails with 401. Back to square one.',
          id_text: { label: 'Salin contoh GitHub acak dan berharap masih berfungsi', meta: 'risiko usang', outcome: 'Contoh menggunakan endpoint yang sudah deprecated. Auth gagal dengan 401. Kembali dari awal.' } },
      ] },

    { type: 'dialogue', char: 'sam', expr: 'stressed',
      text: 'Oke, API-nya jalan. Tapi waktu saya run test pertama, ada error — `KeyError: results`. Schema-nya beda dari yang saya kira.',
      id: { text: 'Oke, API-nya jalan. Tapi waktu saya run test pertama, ada error — `KeyError: results`. Schema-nya beda dari yang saya kira.' } },

    { type: 'task', char: 'sam', expr: 'stressed', phase: 'developer',
      problem: 'The API call runs but the test throws `KeyError: results`. The response schema is not what the docs describe. Need to debug and fix before the VP demo.',
      id: { problem: 'API sudah berjalan tapi test melempar `KeyError: results`. Response schema tidak sesuai dengan yang ada di dokumentasi. Perlu debug dan perbaiki sebelum demo VP.' },
      options: [
        { id: 'dev-2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to debug the error and suggest the fix',
          meta: '~42 sec saved', timeCost: 10, manualCost: 52,
          deltas: { quality: 14, satisfaction: 12 },
          bobResponse: 'Debug complete.\n\n`KeyError: results` — the response key changed in API v2. The actual structure is:\n```json\n{\n  "model_id": "ibm/granite-13b-instruct-v2",\n  "created_at": "...",\n  "results": [{ "generated_text": "..." }]\n}\n```\n\nYour code accesses `resp.json()["results"]` correctly, but the error fires when the request itself fails (non-200). Add a guard:\n```python\nif resp.status_code != 200:\n    raise RuntimeError(f"API error {resp.status_code}: {resp.text}")\nprint(resp.json()["results"][0]["generated_text"])\n```\n\nRoot cause: missing `project_id` parameter in payload. Add `"project_id": PROJECT_ID` to the payload dict.',
          bobFollowUp: 'Apply the fix and re-run the tests',
          followUpDeltas: { quality: 9, satisfaction: 9 },
          outcome: '✓ All 3 tests passed. API integration solid. Demo-ready.',
          id_text: {
            label: 'Minta Bob debug error dan sarankan perbaikan',
            meta: '~42 detik hemat',
            bobResponse: 'Debug selesai.\n\n`KeyError: results` — kunci respons berubah di API v2. Struktur sebenarnya:\n```json\n{\n  "model_id": "ibm/granite-13b-instruct-v2",\n  "created_at": "...",\n  "results": [{ "generated_text": "..." }]\n}\n```\n\nKode Anda mengakses `resp.json()["results"]` dengan benar, tapi error muncul saat request gagal (non-200). Tambahkan guard:\n```python\nif resp.status_code != 200:\n    raise RuntimeError(f"API error {resp.status_code}: {resp.text}")\nprint(resp.json()["results"][0]["generated_text"])\n```\n\nAkar masalah: parameter `project_id` yang hilang di payload. Tambahkan `"project_id": PROJECT_ID` ke dict payload.',
            bobFollowUp: 'Terapkan perbaikan dan jalankan ulang test',
            outcome: '✓ All 3 tests passed. Integrasi API solid. Siap untuk demo.',
          } },
        { id: 'dev-2-manual', type: 'manual', icon: '',
          label: 'Read through the error trace and debug manually',
          meta: '~52 sec', timeCost: 52, manualCost: 52,
          deltas: { quality: 5, satisfaction: 4 },
          outcome: 'Fixed the KeyError. Missed the missing project_id — one test still flaky.',
          id_text: { label: 'Baca error trace dan debug secara manual', meta: '~52 detik', outcome: 'KeyError diperbaiki. project_id yang hilang terlewat — satu test masih flaky.' } },
        { id: 'dev-2-workaround', type: 'poor', icon: '',
          label: 'Wrap everything in a try/except and suppress the error',
          meta: 'hides the bug', timeCost: 5,
          deltas: { quality: -12, satisfaction: -10 },
          outcome: 'No crash — but the demo returns empty output silently. VP notices immediately.',
          id_text: { label: 'Bungkus semua dengan try/except dan sembunyikan error', meta: 'menyembunyikan bug', outcome: 'Tidak crash — tapi demo mengembalikan output kosong diam-diam. VP langsung menyadarinya.' } },
      ] },

    // ── Fase 3 — Relief ───────────────────────────────────────────────────────

    { type: 'dialogue', char: 'sam', expr: 'relief',
      text: 'PR siap. Tinggal review.',
      id: { text: 'PR siap. Tinggal review.' } },

    { type: 'dialogue', char: 'taylor', expr: 'relief',
      text: 'Gimana? Menghemat berapa jam?',
      id: { text: 'Gimana? Menghemat berapa jam?' } },

    { type: 'dialogue', char: 'sam', expr: 'relief',
      text: 'Setidaknya tidak begadang malam ini.',
      id: { text: 'Setidaknya tidak begadang malam ini.' } },

    { type: 'dialogue', char: 'bob',
      text: 'Boilerplate, debug, tests passed.\n\nYou didn\'t read 200 pages. You shipped working code. That\'s what matters before a VP demo.',
      id: { text: 'Boilerplate, debug, test lulus.\n\nKamu tidak membaca 200 halaman. Kamu mengirimkan kode yang berfungsi. Itu yang penting sebelum demo VP.' } },

    { type: 'end' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 🟣 HEAD IT — Taylor Kim  ×  Priya Nair
//    IBM watsonx.governance
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_HEADIT = {
  id: 'headit',
  workstation: { icon: '', label: 'watsonx.governance', label_id: 'watsonx.governance' },
  brief: 'Every team is asking. Nothing is documented. One person can\'t scale alone.',
  scenes: [

    { type: 'chapter', phase: 'headit', title: 'YOUR WORKDAY', subtitle: 'Head IT',
      id: { title: 'HARI KERJAMU', subtitle: 'Kepala IT' } },

    // ── Fase 1 — Problem ─────────────────────────────────────────────────────

    { type: 'dialogue', char: 'narrator',
      text: 'Taylor\'s screen fills with three simultaneous chat notifications.',
      id: { text: 'Layar Taylor dipenuhi tiga notifikasi chat sekaligus.' } },

    { type: 'dialogue', char: 'priya', expr: 'listening',
      text: 'Mba Taylor, bisa minta akses tools AI?',
      id: { text: 'Mba Taylor, bisa minta akses tools AI?' } },

    { type: 'dialogue', char: 'narrator',
      text: 'Sam: "Kapan onboarding AI platform-nya?" | Alex (VP): "Taylor, butuh laporan adopsi AI untuk board meeting."',
      id: { text: 'Sam: "Kapan onboarding AI platform-nya?" | Alex (VP): "Taylor, butuh laporan adopsi AI untuk board meeting."' } },

    { type: 'dialogue', char: 'taylor', expr: 'overwhelm',
      text: 'Semua orang minta sesuatu. Tidak ada dokumentasi. Tidak ada onboarding standar. Kalau saya yang tulis semua ini sendiri... kapan selesainya?',
      id: { text: 'Semua orang minta sesuatu. Tidak ada dokumentasi. Tidak ada onboarding standar. Kalau saya yang tulis semua ini sendiri... kapan selesainya?' } },

    { type: 'dialogue', char: 'narrator',
      text: 'A notification appears on screen: "Bob dapat membantu Anda membuat dokumentasi, policy, dan onboarding material."',
      id: { text: 'Notifikasi muncul di layar: "Bob dapat membantu Anda membuat dokumentasi, policy, dan onboarding material."' } },

    // ── Fase 2 — Laptop / Hands-on ───────────────────────────────────────────

    { type: 'task', char: 'taylor', expr: 'overwhelm', phase: 'headit',
      problem: 'Three teams need onboarding, AI access, and a governance report — all at once, no documentation exists. What do you do first?',
      id: { problem: 'Tiga tim butuh onboarding, akses AI, dan laporan governance — sekaligus, tidak ada dokumentasi yang ada. Apa yang dilakukan pertama?' },
      options: [
        { id: 'hit-1-bob', type: 'bob', icon: '',
          label: 'Ask Bob to generate the AI onboarding guide',
          meta: '~45 sec saved', timeCost: 11, manualCost: 56,
          deltas: { quality: 14, satisfaction: 11 },
          bobResponse: 'AI Onboarding Guide — Draft generated.\n\n**Section 1 — Getting Started**\n• Request access via IT portal → approval within 1 business day\n• Login at: watsonx.ibm.com with your IBMid\n• Recommended first tool: Prompt Lab (no code required)\n\n**Section 2 — What You Can Do**\n• Ask questions about internal documents\n• Summarise long reports\n• Draft emails, policies, and runbooks\n• Generate and explain code\n\n**Section 3 — What NOT to Do**\n• Do not input PII or confidential client data\n• Do not use AI output without human review for regulated content\n• Do not share credentials\n\n**Section 4 — Support**\n• IT helpdesk: #ai-support Slack channel\n• FAQ: [internal wiki link]\n\nReady for your review. Edit and publish when approved.',
          bobFollowUp: 'Review and publish the onboarding guide',
          followUpDeltas: { quality: 8, satisfaction: 8 },
          outcome: 'Onboarding guide published. Teams unblocked. ✓',
          id_text: {
            label: 'Minta Bob menghasilkan onboarding guide AI',
            meta: '~45 detik hemat',
            bobResponse: 'Panduan Onboarding AI — Draft dihasilkan.\n\n**Bagian 1 — Mulai**\n• Minta akses melalui portal IT → persetujuan dalam 1 hari kerja\n• Login di: watsonx.ibm.com dengan IBMid Anda\n• Tool pertama yang direkomendasikan: Prompt Lab (tidak perlu kode)\n\n**Bagian 2 — Apa yang Bisa Dilakukan**\n• Ajukan pertanyaan tentang dokumen internal\n• Ringkas laporan panjang\n• Draft email, policy, dan runbook\n• Generate dan jelaskan kode\n\n**Bagian 3 — Yang TIDAK Boleh Dilakukan**\n• Jangan masukkan PII atau data klien rahasia\n• Jangan gunakan output AI tanpa review manusia untuk konten yang diatur\n• Jangan bagikan kredensial\n\n**Bagian 4 — Dukungan**\n• Helpdesk IT: channel Slack #ai-support\n• FAQ: [tautan wiki internal]\n\nSiap untuk ditinjau. Edit dan publikasikan saat disetujui.',
            bobFollowUp: 'Tinjau dan publikasikan panduan onboarding',
            outcome: 'Panduan onboarding diterbitkan. Tim tidak terblokir lagi. ✓',
          } },
        { id: 'hit-1-manual', type: 'manual', icon: '',
          label: 'Write the onboarding guide manually from scratch',
          meta: '~56 sec', timeCost: 56, manualCost: 56,
          deltas: { quality: 5, satisfaction: 3 },
          outcome: 'Guide written, but only covers two of the three teams. Access matrix still missing.',
          id_text: { label: 'Tulis panduan onboarding secara manual dari awal', meta: '~56 detik', outcome: 'Panduan ditulis, tapi hanya mencakup dua dari tiga tim. Access matrix masih belum ada.' } },
        { id: 'hit-1-later', type: 'ignore', icon: '',
          label: 'Reply to each team individually — handle it case by case',
          meta: 'not scalable', timeCost: 10,
          deltas: { quality: -10, satisfaction: -14 },
          outcome: 'Three separate threads. No documentation. Same questions come back next week.',
          id_text: { label: 'Balas setiap tim secara individual — tangani kasus per kasus', meta: 'tidak skalabel', outcome: 'Tiga thread terpisah. Tidak ada dokumentasi. Pertanyaan yang sama datang kembali minggu depan.' } },
      ] },

    { type: 'dialogue', char: 'taylor', expr: 'lecturing',
      text: 'Guide sudah ada. Sekarang tinggal satu lagi — AI governance policy untuk board meeting VP.',
      id: { text: 'Guide sudah ada. Sekarang tinggal satu lagi — AI governance policy untuk board meeting VP.' } },

    { type: 'task', char: 'taylor', expr: 'lecturing', phase: 'headit',
      problem: 'The VP needs an AI adoption report and governance policy for the board meeting. No policy exists yet. How do you produce it in time?',
      id: { problem: 'VP butuh laporan adopsi AI dan governance policy untuk board meeting. Belum ada policy yang ada. Bagaimana menghasilkannya tepat waktu?' },
      options: [
        { id: 'hit-2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to draft the AI governance policy',
          meta: '~48 sec saved', timeCost: 12, manualCost: 60,
          deltas: { quality: 15, satisfaction: 13 },
          bobResponse: 'AI Governance Policy — Draft generated.\n\n**1. Purpose**\nThis policy defines responsible use of AI tools across the organisation, aligned with IBM watsonx.governance standards.\n\n**2. Scope**\nApplies to all employees using AI-assisted tools including watsonx, Bob, and approved third-party AI.\n\n**3. Principles**\n• Transparency: AI-generated content must be disclosed when used in official outputs.\n• Human oversight: All AI recommendations require human review before action.\n• Data minimisation: Do not input data beyond what is necessary for the task.\n• Accountability: The human who prompts is responsible for the output.\n\n**4. Prohibited Uses**\n• Automated decision-making without human review for personnel, legal, or financial decisions.\n• Processing sensitive PII without explicit approval from the Data Protection Officer.\n\n**5. Access & Review**\nPolicy reviewed annually. Access requests handled via IT portal.\n\nDraft ready — review and approve to publish.',
          bobFollowUp: 'Approve and publish the governance policy',
          followUpDeltas: { quality: 9, satisfaction: 10 },
          outcome: 'Published ✓  Governance policy live. Board meeting report ready.',
          id_text: {
            label: 'Minta Bob membuat draft AI governance policy',
            meta: '~48 detik hemat',
            bobResponse: 'AI Governance Policy — Draft dihasilkan.\n\n**1. Tujuan**\nKebijakan ini mendefinisikan penggunaan AI yang bertanggung jawab di seluruh organisasi, selaras dengan standar IBM watsonx.governance.\n\n**2. Cakupan**\nBerlaku untuk semua karyawan yang menggunakan AI termasuk watsonx, Bob, dan AI pihak ketiga yang disetujui.\n\n**3. Prinsip**\n• Transparansi: Konten yang dihasilkan AI harus diungkapkan saat digunakan dalam output resmi.\n• Pengawasan manusia: Semua rekomendasi AI memerlukan tinjauan manusia sebelum ditindaklanjuti.\n• Minimisasi data: Jangan memasukkan data melebihi yang diperlukan untuk tugas tersebut.\n• Akuntabilitas: Manusia yang memberikan prompt bertanggung jawab atas hasilnya.\n\n**4. Penggunaan yang Dilarang**\n• Pengambilan keputusan otomatis tanpa tinjauan manusia untuk keputusan SDM, hukum, atau keuangan.\n• Memproses PII sensitif tanpa persetujuan eksplisit dari Petugas Perlindungan Data.\n\n**5. Akses & Tinjauan**\nKebijakan ditinjau setiap tahun. Permintaan akses ditangani melalui portal IT.\n\nDraft siap — tinjau dan setujui untuk diterbitkan.',
            bobFollowUp: 'Setujui dan terbitkan governance policy',
            outcome: 'Published ✓  Governance policy aktif. Laporan board meeting siap.',
          } },
        { id: 'hit-2-manual', type: 'manual', icon: '',
          label: 'Write the governance policy manually',
          meta: '~60 sec', timeCost: 60, manualCost: 60,
          deltas: { quality: 5, satisfaction: 4 },
          outcome: 'Policy drafted. Incomplete — missing data minimisation and accountability sections.',
          id_text: { label: 'Tulis governance policy secara manual', meta: '~60 detik', outcome: 'Policy di-draft. Tidak lengkap — bagian minimisasi data dan akuntabilitas hilang.' } },
        { id: 'hit-2-delay', type: 'poor', icon: '',
          label: 'Tell the VP the policy needs more time — postpone the report',
          meta: 'delays board meeting', timeCost: 2,
          deltas: { quality: -10, satisfaction: -16 },
          outcome: 'Board meeting postponed. VP frustrated. Credibility dented.',
          id_text: { label: 'Beritahu VP bahwa policy butuh lebih banyak waktu — tunda laporan', meta: 'menunda board meeting', outcome: 'Board meeting ditunda. VP frustrasi. Kredibilitas terganggu.' } },
      ] },

    // ── Fase 3 — Relief ───────────────────────────────────────────────────────

    { type: 'dialogue', char: 'taylor', expr: 'relief',
      text: 'Onboarding guide, governance policy, akses matrix — semua draft selesai dalam satu session.',
      id: { text: 'Onboarding guide, governance policy, akses matrix — semua draft selesai dalam satu session.' } },

    { type: 'dialogue', char: 'priya', expr: 'relief',
      text: 'Mba Taylor, dokumentasinya sudah ada ya? Helpful banget!',
      id: { text: 'Mba Taylor, dokumentasinya sudah ada ya? Helpful banget!' } },

    { type: 'dialogue', char: 'taylor', expr: 'relief',
      text: 'Ini bukan soal saya kerja lebih keras. Ini soal semua orang bisa kerja lebih pintar.',
      id: { text: 'Ini bukan soal saya kerja lebih keras. Ini soal semua orang bisa kerja lebih pintar.' } },

    { type: 'dialogue', char: 'bob',
      text: 'Onboarding guide. Governance policy. Access matrix.\n\nThree things that would take a week to write — done in one session. That\'s what scaling yourself looks like.',
      id: { text: 'Panduan onboarding. Governance policy. Access matrix.\n\nTiga hal yang butuh seminggu untuk ditulis — selesai dalam satu sesi. Itulah cara melipat gandakan diri sendiri.' } },

    { type: 'end' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔴 VP / DIRECTOR — Alex Chen  ×  Priya Nair
//    IBM Bob / watsonx.orchestrate
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_VP = {
  id: 'vp',
  workstation: { icon: '', label: 'Executive Dashboard', label_id: 'Dasbor Eksekutif' },
  brief: 'Three proposals. One board meeting. 45 minutes to make the call.',
  scenes: [

    { type: 'chapter', phase: 'vp', title: 'YOUR WORKDAY', subtitle: 'VP / Director',
      id: { title: 'HARI KERJAMU', subtitle: 'VP / Direktur' } },

    // ── Fase 1 — Problem ─────────────────────────────────────────────────────

    { type: 'dialogue', char: 'narrator',
      text: 'Boardroom. Alex reads three thick proposals, one after another.',
      id: { text: 'Ruang boardroom. Alex membaca tiga proposal tebal, satu per satu.' } },

    { type: 'dialogue', char: 'alex',
      text: 'Tiga proposal dari tiga tim berbeda. Budget request berbeda semua. Board meeting 45 menit lagi. Saya harus buat keputusan sekarang.',
      id: { text: 'Tiga proposal dari tiga tim berbeda. Budget request berbeda semua. Board meeting 45 menit lagi. Saya harus buat keputusan sekarang.' } },

    { type: 'dialogue', char: 'priya', expr: 'listening',
      text: 'Pak Alex, untuk kasus seperti ini — coba pakai Bob. Dia bisa synthesize semua ini jadi executive summary plus trade-off analysis.',
      id: { text: 'Pak Alex, untuk kasus seperti ini — coba pakai Bob. Dia bisa synthesize semua ini jadi executive summary plus trade-off analysis.' } },

    { type: 'dialogue', char: 'alex',
      text: 'AI bisa bantu saya buat keputusan?',
      id: { text: 'AI bisa bantu saya buat keputusan?' } },

    { type: 'dialogue', char: 'priya', expr: 'listening',
      text: 'Bukan menggantikan keputusan Anda — tapi memberi Anda clarity yang lebih cepat.',
      id: { text: 'Bukan menggantikan keputusan Anda — tapi memberi Anda clarity yang lebih cepat.' } },

    // ── Fase 2 — Laptop / Hands-on ───────────────────────────────────────────

    { type: 'task', char: 'alex', phase: 'vp',
      problem: 'Three proposals from three teams — different scopes, different budgets. Board meeting in 45 minutes. You need a clear summary of what each proposes before you can decide.',
      id: { problem: 'Tiga proposal dari tiga tim — cakupan berbeda, anggaran berbeda. Board meeting 45 menit lagi. Butuh ringkasan yang jelas dari masing-masing proposal sebelum bisa memutuskan.' },
      options: [
        { id: 'vp-1-bob', type: 'bob', icon: '',
          label: 'Ask Bob to summarise all three proposals',
          meta: '~45 sec saved', timeCost: 11, manualCost: 56,
          deltas: { quality: 14, satisfaction: 12 },
          bobResponse: 'Executive Summary — 3 Proposals.\n\n**Proposal A — AI Customer Support Platform**\nTeam: Product + Engineering | Budget: $280,000\nScope: Deploy AI chatbot to handle Tier-1 support tickets. Estimated 40% reduction in support costs. Timeline: 6 months.\nRisk: Integration complexity with legacy CRM (rated medium).\n\n**Proposal B — Data Analytics Modernisation**\nTeam: Data + IT | Budget: $195,000\nScope: Migrate reporting stack to watsonx.data. Real-time dashboards for all BUs. Timeline: 4 months.\nRisk: Data migration downtime (rated low — phased approach).\n\n**Proposal C — AI Governance Framework**\nTeam: IT + Legal | Budget: $85,000\nScope: Policy documentation, access management, compliance audit trail. Timeline: 2 months.\nRisk: Minimal — documentation-only initiative.\n\nReady for trade-off analysis.',
          bobFollowUp: 'Generate trade-off analysis and executive brief',
          followUpDeltas: { quality: 9, satisfaction: 10 },
          outcome: 'Executive Brief Ready ✓  All three proposals summarised and compared. Board-ready.',
          id_text: {
            label: 'Minta Bob meringkas ketiga proposal',
            meta: '~45 detik hemat',
            bobResponse: 'Ringkasan Eksekutif — 3 Proposal.\n\n**Proposal A — Platform Dukungan Pelanggan AI**\nTim: Produk + Engineering | Anggaran: $280.000\nCakupan: Deploy chatbot AI untuk menangani tiket dukungan Tier-1. Estimasi pengurangan biaya dukungan 40%. Timeline: 6 bulan.\nRisiko: Kompleksitas integrasi dengan CRM lama (dinilai sedang).\n\n**Proposal B — Modernisasi Analitik Data**\nTim: Data + IT | Anggaran: $195.000\nCakupan: Migrasi stack pelaporan ke watsonx.data. Dashboard real-time untuk semua BU. Timeline: 4 bulan.\nRisiko: Downtime migrasi data (dinilai rendah — pendekatan bertahap).\n\n**Proposal C — Kerangka AI Governance**\nTim: IT + Legal | Anggaran: $85.000\nCakupan: Dokumentasi policy, manajemen akses, audit trail kepatuhan. Timeline: 2 bulan.\nRisiko: Minimal — hanya inisiatif dokumentasi.\n\nSiap untuk analisis trade-off.',
            bobFollowUp: 'Hasilkan analisis trade-off dan executive brief',
            outcome: 'Executive Brief Ready ✓  Ketiga proposal diringkas dan dibandingkan. Siap untuk board.',
          } },
        { id: 'vp-1-manual', type: 'manual', icon: '',
          label: 'Read all three proposals and draft the summary manually',
          meta: '~56 sec', timeCost: 56, manualCost: 56,
          deltas: { quality: 5, satisfaction: 3 },
          outcome: 'Summary written for two proposals. No time for the third before the meeting.',
          id_text: { label: 'Baca ketiga proposal dan buat ringkasan secara manual', meta: '~56 detik', outcome: 'Ringkasan ditulis untuk dua proposal. Tidak ada waktu untuk yang ketiga sebelum meeting.' } },
        { id: 'vp-1-skip', type: 'ignore', icon: '',
          label: 'Walk into the meeting with the raw proposals and decide on the spot',
          meta: 'high uncertainty', timeCost: 0,
          deltas: { quality: -12, satisfaction: -16 },
          outcome: 'Board asks questions you can\'t answer quickly. Decision delayed by two weeks.',
          id_text: { label: 'Masuk meeting dengan proposal mentah dan putuskan di tempat', meta: 'ketidakpastian tinggi', outcome: 'Board mengajukan pertanyaan yang tidak bisa dijawab cepat. Keputusan ditunda dua minggu.' } },
      ] },

    { type: 'dialogue', char: 'alex',
      text: 'Bagus. Sekarang saya butuh rekomendasi mana yang harus diprioritaskan — dan draft keputusan untuk board.',
      id: { text: 'Bagus. Sekarang saya butuh rekomendasi mana yang harus diprioritaskan — dan draft keputusan untuk board.' } },
    // alex has no expression variants — full-body used throughout

    { type: 'task', char: 'alex', phase: 'vp',
      problem: 'Three proposals summarised. Now you need a prioritisation recommendation and a draft decision document for the board, in the next 15 minutes.',
      id: { problem: 'Tiga proposal sudah diringkas. Sekarang butuh rekomendasi prioritas dan draft keputusan untuk board, dalam 15 menit ke depan.' },
      options: [
        { id: 'vp-2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to generate the trade-off matrix and draft the decision',
          meta: '~48 sec saved', timeCost: 12, manualCost: 60,
          deltas: { quality: 15, satisfaction: 14 },
          bobResponse: 'Trade-off Matrix + Draft Decision.\n\n| Criteria         | Proposal A | Proposal B | Proposal C |\n|------------------|-----------|-----------|------------|\n| Strategic impact | High      | High      | Medium     |\n| Budget           | $280K     | $195K     | $85K       |\n| Time to value    | 6 months  | 4 months  | 2 months   |\n| Risk             | Medium    | Low       | Minimal    |\n\n**Recommended sequencing:**\n1. Proposal C first (2 months, minimal risk — establishes governance foundation)\n2. Proposal B second (4 months — builds data infrastructure)\n3. Proposal A third (6 months — highest ROI but depends on B\'s data layer)\n\n**Draft decision for board:**\n"We recommend approving all three proposals in sequence (C → B → A), with a combined budget of $560,000 over 12 months. This sequence minimises risk and ensures each initiative builds on the previous one."\n\nReview and sign off.',
          bobFollowUp: 'Finalise and present to the board',
          followUpDeltas: { quality: 9, satisfaction: 12 },
          outcome: 'Executive Brief Ready ✓  Board approves the sequenced plan unanimously.',
          id_text: {
            label: 'Minta Bob menghasilkan trade-off matrix dan draft keputusan',
            meta: '~48 detik hemat',
            bobResponse: 'Trade-off Matrix + Draft Keputusan.\n\n| Kriteria          | Proposal A | Proposal B | Proposal C |\n|-------------------|-----------|-----------|------------|\n| Dampak strategis  | Tinggi    | Tinggi    | Sedang     |\n| Anggaran          | $280K     | $195K     | $85K       |\n| Waktu ke nilai    | 6 bulan   | 4 bulan   | 2 bulan    |\n| Risiko            | Sedang    | Rendah    | Minimal    |\n\n**Urutan yang direkomendasikan:**\n1. Proposal C dulu (2 bulan, risiko minimal — menetapkan fondasi governance)\n2. Proposal B kedua (4 bulan — membangun infrastruktur data)\n3. Proposal A ketiga (6 bulan — ROI tertinggi tapi bergantung pada lapisan data B)\n\n**Draft keputusan untuk board:**\n"Kami merekomendasikan menyetujui ketiga proposal secara berurutan (C → B → A), dengan anggaran gabungan $560.000 selama 12 bulan. Urutan ini meminimalkan risiko dan memastikan setiap inisiatif dibangun di atas yang sebelumnya."\n\nTinjau dan tanda tangani.',
            bobFollowUp: 'Finalisasi dan presentasikan ke board',
            outcome: 'Executive Brief Ready ✓  Board menyetujui rencana berurutan dengan suara bulat.',
          } },
        { id: 'vp-2-manual', type: 'manual', icon: '',
          label: 'Manually compare the proposals and write the decision document',
          meta: '~60 sec', timeCost: 60, manualCost: 60,
          deltas: { quality: 5, satisfaction: 4 },
          outcome: 'Decision drafted. No formal trade-off matrix — board asks for more analysis.',
          id_text: { label: 'Bandingkan proposal secara manual dan tulis dokumen keputusan', meta: '~60 detik', outcome: 'Keputusan di-draft. Tidak ada trade-off matrix formal — board meminta lebih banyak analisis.' } },
        { id: 'vp-2-gut', type: 'poor', icon: '',
          label: 'Go with your gut — pick the cheapest proposal and explain later',
          meta: 'no rationale', timeCost: 2,
          deltas: { quality: -11, satisfaction: -14 },
          outcome: 'Board approves but requests a written justification before releasing budget. Back to square one.',
          id_text: { label: 'Ikuti insting — pilih proposal termurah dan jelaskan nanti', meta: 'tanpa alasan', outcome: 'Board menyetujui tapi meminta justifikasi tertulis sebelum melepaskan anggaran. Kembali dari awal.' } },
      ] },

    // ── Fase 3 — Relief ───────────────────────────────────────────────────────

    { type: 'dialogue', char: 'alex',
      text: 'Saya masuk meeting dengan clarity, bukan dengan tumpukan dokumen.',
      id: { text: 'Saya masuk meeting dengan clarity, bukan dengan tumpukan dokumen.' } },

    { type: 'dialogue', char: 'priya', expr: 'relief',
      text: 'Keputusan tetap milik Anda. Bob hanya pastikan Anda tidak kehilangan informasi penting.',
      id: { text: 'Keputusan tetap milik Anda. Bob hanya pastikan Anda tidak kehilangan informasi penting.' } },

    { type: 'dialogue', char: 'alex',
      text: 'Ini yang selalu saya butuhkan — bukan lebih banyak data. Lebih sedikit kebisingan.',
      id: { text: 'Ini yang selalu saya butuhkan — bukan lebih banyak data. Lebih sedikit kebisingan.' } },

    { type: 'dialogue', char: 'bob',
      text: 'Three proposals. One clear decision. Board meeting in 15 minutes.\n\nThe decision is always yours. I just made sure you had the right information to make it.',
      id: { text: 'Tiga proposal. Satu keputusan yang jelas. Board meeting dalam 15 menit.\n\nKeputusan selalu milik Anda. Saya hanya memastikan Anda punya informasi yang tepat untuk membuatnya.' } },

    { type: 'end' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry — maps roleId -> scenario object
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_SCENARIOS = {
  analyst:   ROLE_ANALYST,
  developer: ROLE_DEVELOPER,
  headit:    ROLE_HEADIT,
  vp:        ROLE_VP,
};

window.ROLE_SCENARIOS = ROLE_SCENARIOS;
