import express from 'express';
import { query } from '../db/pool.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Allowed tables for generic CRUD to prevent SQL injection/unauthorized access
const ALLOWED_TABLES = new Set([
  'countries',
  'cities',
  'programs',
  'blog_posts',
  'events',
  'contact_requests',
  'donation_requests',
  'volunteer_applications',
  'bookings'
]);

// Helper to check table name
const validateTable = (table: string) => {
  if (!ALLOWED_TABLES.has(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }
};

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
router.get('/stats', authenticate, async (req, res) => {
  try {
    const [tours, programs, contacts, volunteers, donations] = await Promise.all([
      query('SELECT COUNT(*) FROM tours'),
      query('SELECT COUNT(*) FROM programs'),
      query("SELECT COUNT(*) FROM contact_requests WHERE status = 'pending'"),
      query("SELECT COUNT(*) FROM volunteer_applications WHERE status = 'pending'"),
      query('SELECT COUNT(*) FROM donation_requests'),
    ]);

    return res.json({
      totalTours: parseInt(tours.rows[0].count),
      totalPrograms: parseInt(programs.rows[0].count),
      pendingContacts: parseInt(contacts.rows[0].count),
      pendingVolunteers: parseInt(volunteers.rows[0].count),
      totalDonations: parseInt(donations.rows[0].count),
      recentActivity: parseInt(contacts.rows[0].count) + parseInt(volunteers.rows[0].count)
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ─── Generic LIST (GET /api/admin/:table) ──────────────────────────────────
router.get('/:table', authenticate, async (req, res) => {
  try {
    const { table } = req.params;
    validateTable(table);

    let sql = '';
    const params: any[] = [];

    // Implement specific joins for nested resources
    if (table === 'cities') {
      const countryId = req.query.countryId;
      if (countryId) {
        sql = `
          SELECT ci.*,
                 json_build_object('id', co.id, 'name', co.name) AS countries
          FROM cities ci
          LEFT JOIN countries co ON co.id = ci.country_id
          WHERE ci.country_id = $1
          ORDER BY ci.name ASC
        `;
        params.push(countryId);
      } else {
        sql = `
          SELECT ci.*,
                 json_build_object('id', co.id, 'name', co.name) AS countries
          FROM cities ci
          LEFT JOIN countries co ON co.id = ci.country_id
          ORDER BY ci.name ASC
        `;
      }
    } else if (table === 'programs') {
      sql = `
        SELECT p.*,
               json_build_object(
                 'name', ci.name,
                 'countries', json_build_object('name', co.name)
               ) AS cities
        FROM programs p
        LEFT JOIN cities ci ON ci.id = p.city_id
        LEFT JOIN countries co ON co.id = ci.country_id
        ORDER BY p.created_at DESC
      `;
    } else if (table === 'volunteer_applications') {
      sql = `
        SELECT va.*,
               json_build_object('title', pr.title) AS programs
        FROM volunteer_applications va
        LEFT JOIN programs pr ON pr.id = va.program_id
        ORDER BY va.created_at DESC
      `;
    } else {
      sql = `SELECT * FROM "${table}" ORDER BY created_at DESC`;
    }

    const { rows } = await query(sql, params);
    return res.json(rows);
  } catch (error: any) {
    console.error(`Error listing ${req.params.table}:`, error);
    return res.status(500).json({ error: error.message || 'Database error' });
  }
});

// ─── Generic GET ONE (GET /api/admin/:table/:id) ─────────────────────────────
router.get('/:table/:id', authenticate, async (req, res) => {
  try {
    const { table, id } = req.params;
    validateTable(table);

    let sql = '';
    if (table === 'programs') {
      sql = `
        SELECT p.*,
               json_build_object(
                 'id', ci.id,
                 'name', ci.name,
                 'countries', json_build_object('id', co.id, 'name', co.name)
               ) AS cities
        FROM programs p
        LEFT JOIN cities ci ON ci.id = p.city_id
        LEFT JOIN countries co ON co.id = ci.country_id
        WHERE p.id = $1
      `;
    } else {
      sql = `SELECT * FROM "${table}" WHERE id = $1`;
    }

    const { rows } = await query(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    return res.json(rows[0]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── Generic CREATE (POST /api/admin/:table) ───────────────────────────────
router.post('/:table', authenticate, async (req, res) => {
  try {
    const { table } = req.params;
    validateTable(table);

    const body = { ...req.body };
    delete body.id; // Let database generate UUID

    // Convert object to insert statement
    const cols = Object.keys(body);
    const vals = Object.values(body);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

    const sql = `
      INSERT INTO "${table}" (${cols.map(c => `"${c}"`).join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const { rows } = await query(sql, vals);
    return res.status(201).json(rows[0]);
  } catch (error: any) {
    console.error(`Error creating in ${req.params.table}:`, error);
    return res.status(500).json({ error: error.message });
  }
});

// ─── Generic UPDATE (PUT /api/admin/:table/:id) ─────────────────────────────
router.put('/:table/:id', authenticate, async (req, res) => {
  try {
    const { table, id } = req.params;
    validateTable(table);

    const body = { ...req.body };
    delete body.id;
    delete body.created_at;
    delete body.updated_at;

    // Handle joined properties nested in response but shouldn't be updated directly in table
    delete body.cities;
    delete body.countries;
    delete body.programs;

    const keys = Object.keys(body);
    const vals = Object.values(body);

    if (keys.length === 0) {
      return res.status(400).json({ error: 'No update fields provided' });
    }

    const sets = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const sql = `
      UPDATE "${table}"
      SET ${sets}, updated_at = NOW()
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;

    const { rows } = await query(sql, [...vals, id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    return res.json(rows[0]);
  } catch (error: any) {
    console.error(`Error updating in ${req.params.table}:`, error);
    return res.status(500).json({ error: error.message });
  }
});

// ─── Generic DELETE (DELETE /api/admin/:table/:id) ──────────────────────────
router.delete('/:table/:id', authenticate, async (req, res) => {
  try {
    const { table, id } = req.params;
    validateTable(table);

    const sql = `DELETE FROM "${table}" WHERE id = $1 RETURNING id`;
    const { rows } = await query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    return res.json({ success: true, id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
