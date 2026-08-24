/**
 * js/pages/code.js
 * Scripted demo for the Code page.
 * Requires: css/pages.css, js/chat-helpers.js
 */
(function () {
  BcpChat.init([
    {
      user: "I have a Node.js Express route that fetches user orders from a database. It's slow and hard to read. Can you help refactor it?",
      bob:  "Sure! Here's what I'd suggest for the refactor:\n\n```javascript\n// Before — nested callbacks, unhandled errors\napp.get('/orders', (req, res) => {\n  db.query('SELECT * FROM orders WHERE user_id=' + req.user.id, (err, rows) => {\n    if (err) throw err;\n    res.json(rows);\n  });\n});\n\n// After — async/await, parameterised query, error middleware\napp.get('/orders', async (req, res, next) => {\n  try {\n    const rows = await db.query(\n      'SELECT * FROM orders WHERE user_id = ?',\n      [req.user.id]\n    );\n    res.json(rows);\n  } catch (err) {\n    next(err);\n  }\n});\n```\n\nKey improvements:\n• Parameterised query — eliminates SQL injection risk\n• async/await — linear, readable control flow\n• Errors routed to Express error middleware instead of crashing\n\nShall I also add pagination and an index hint?"
    },
    {
      user: "Yes, add pagination and also generate a unit test for this route.",
      bob:  "Here's the paginated route plus a Jest unit test:\n\n```javascript\n// Route with pagination\napp.get('/orders', async (req, res, next) => {\n  const page  = Math.max(1, parseInt(req.query.page)  || 1);\n  const limit = Math.min(100, parseInt(req.query.limit) || 20);\n  const offset = (page - 1) * limit;\n  try {\n    const [rows, [{ total }]] = await Promise.all([\n      db.query('SELECT * FROM orders WHERE user_id=? LIMIT ? OFFSET ?',\n               [req.user.id, limit, offset]),\n      db.query('SELECT COUNT(*) AS total FROM orders WHERE user_id=?',\n               [req.user.id])\n    ]);\n    res.json({ data: rows, page, limit, total: total });\n  } catch (err) { next(err); }\n});\n```\n\n```javascript\n// Jest unit test\ndescribe('GET /orders', () => {\n  it('returns paginated orders for authenticated user', async () => {\n    db.query.mockResolvedValueOnce(mockOrders)\n            .mockResolvedValueOnce([{ total: 42 }]);\n    const res = await request(app)\n      .get('/orders?page=1&limit=10')\n      .set('Authorization', 'Bearer testtoken');\n    expect(res.status).toBe(200);\n    expect(res.body.data).toHaveLength(mockOrders.length);\n    expect(res.body.total).toBe(42);\n  });\n});\n```"
    },
    {
      user: "Can you also explain what the Promise.all pattern does here and why it's better?",
      bob:  "Great question! Here's the breakdown:\n\n⚡ What Promise.all does\nPromise.all([queryA, queryB]) fires both database queries at the same time (in parallel) and waits for both to finish before continuing.\n\nWithout it, the queries run sequentially:\n  1. Fetch orders   → wait 40 ms\n  2. Fetch count    → wait 40 ms\n  Total: ~80 ms\n\nWith Promise.all, they overlap:\n  1. Fetch orders   ┐\n  2. Fetch count    ┘  both ~40 ms\n  Total: ~40 ms  ← 2× faster\n\n✅ Why it's better here\n• The two queries are independent — neither needs the other's result to start\n• Reduces perceived latency by half at no code complexity cost\n• The destructuring [ rows, [{ total }] ] cleanly unpacks both results in one line\n\n⚠️ When NOT to use it\nIf query B depends on query A's result (e.g. you need an ID from the first query to run the second), use sequential await instead — Promise.all won't help there."
    }
  ], 'code demo');
})();
