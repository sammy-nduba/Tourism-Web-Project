import { query } from '../db/pool.js';
import crypto from 'crypto';
const TOUR_SELECT = `
  t.*,
  JSON_OBJECT(
    'id', ci.id,
    'name', ci.name,
    'countries', JSON_OBJECT(
      'id', co.id,
      'name', co.name
    )
  ) AS cities
`;
const TOUR_JOINS = `
  FROM tours t
  LEFT JOIN cities   ci ON ci.id = t.city_id
  LEFT JOIN countries co ON co.id = ci.country_id
`;
export class AdminService {
    async createTour(data) {
        const id = data.id || crypto.randomUUID();
        const finalData = { ...data, id };
        const cols = Object.keys(finalData);
        const vals = Object.values(finalData);
        const placeholders = cols.map(() => '?').join(', ');
        const sql = `
      INSERT INTO tours (${cols.join(', ')})
      VALUES (${placeholders})
    `;
        await query(sql, vals);
        const { rows } = await query(`SELECT * FROM tours WHERE id = ?`, [id]);
        return rows[0];
    }
    async getTour(id) {
        const sql = `SELECT ${TOUR_SELECT} ${TOUR_JOINS} WHERE t.id = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] ?? null;
    }
    async getTourBySlug(slug) {
        const sql = `SELECT ${TOUR_SELECT} ${TOUR_JOINS} WHERE t.slug = $1`;
        const { rows } = await query(sql, [slug]);
        return rows[0] ?? null;
    }
    async updateTour(id, updates) {
        const keys = Object.keys(updates);
        const vals = Object.values(updates);
        const sets = keys.map((k) => `\`${k}\` = ?`).join(', ');
        const sql = `
      UPDATE tours SET ${sets}, updated_at = NOW()
      WHERE id = ?
    `;
        await query(sql, [...vals, id]);
        const { rows } = await query(`SELECT * FROM tours WHERE id = ?`, [id]);
        return rows[0];
    }
    async deleteTour(id) {
        await query('DELETE FROM tours WHERE id = $1', [id]);
    }
    async getTours(filters = {}) {
        const conditions = [];
        const params = [];
        this._applyFilters(conditions, params, filters, false);
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const limitClause = filters.limit ? `LIMIT $${params.length + 1}` : '';
        if (filters.limit)
            params.push(filters.limit);
        const offsetClause = filters.offset ? `OFFSET $${params.length + 1}` : '';
        if (filters.offset)
            params.push(filters.offset);
        const sql = `
      SELECT ${TOUR_SELECT} ${TOUR_JOINS}
      ${where}
      ORDER BY t.created_at DESC
      ${limitClause} ${offsetClause}
    `;
        const { rows } = await query(sql, params);
        return rows;
    }
    async getPublishedTours(filters = {}) {
        const conditions = ['t.is_published = true'];
        const params = [];
        this._applyFilters(conditions, params, filters, true);
        const where = `WHERE ${conditions.join(' AND ')}`;
        const limitClause = filters.limit ? `LIMIT $${params.length + 1}` : '';
        if (filters.limit)
            params.push(filters.limit);
        const offsetClause = filters.offset ? `OFFSET $${params.length + 1}` : '';
        if (filters.offset)
            params.push(filters.offset);
        const sql = `
      SELECT ${TOUR_SELECT} ${TOUR_JOINS}
      ${where}
      ORDER BY t.created_at DESC
      ${limitClause} ${offsetClause}
    `;
        const { rows } = await query(sql, params);
        return rows;
    }
    async getFeaturedTours(limit = 6) {
        const sql = `
      SELECT ${TOUR_SELECT} ${TOUR_JOINS}
      WHERE t.is_published = true AND t.featured = true
      ORDER BY t.created_at DESC
      LIMIT $1
    `;
        const { rows } = await query(sql, [limit]);
        return rows;
    }
    async getToursByCountry(filters = {}) {
        return this.getPublishedTours(filters);
    }
    async searchTours(filters = {}) {
        const conditions = ['t.is_published = true'];
        const params = [];
        this._applyFilters(conditions, params, filters, true);
        const where = `WHERE ${conditions.join(' AND ')}`;
        const limitClause = filters.limit ? `LIMIT $${params.length + 1}` : 'LIMIT 20';
        if (filters.limit)
            params.push(filters.limit);
        const offsetClause = filters.offset ? `OFFSET $${params.length + 1}` : '';
        if (filters.offset)
            params.push(filters.offset);
        const sql = `
      SELECT ${TOUR_SELECT} ${TOUR_JOINS}
      ${where}
      ORDER BY t.created_at DESC
      ${limitClause} ${offsetClause}
    `;
        const { rows } = await query(sql, params);
        return rows;
    }
    async getCountries() {
        const { rows } = await query('SELECT * FROM countries ORDER BY name');
        return rows;
    }
    async getCountryWithCities(countryId) {
        const { rows: countries } = await query('SELECT * FROM countries WHERE id = $1', [countryId]);
        if (!countries[0])
            return null;
        const { rows: cities } = await query('SELECT * FROM cities WHERE country_id = $1 ORDER BY name', [countryId]);
        return { ...countries[0], cities };
    }
    async createCountry(data) {
        const id = data.id || crypto.randomUUID();
        const finalData = { ...data, id };
        const cols = Object.keys(finalData);
        const vals = Object.values(finalData);
        const placeholders = cols.map(() => '?').join(', ');
        const sql = `INSERT INTO countries (${cols.join(', ')}) VALUES (${placeholders})`;
        await query(sql, vals);
        const { rows } = await query(`SELECT * FROM countries WHERE id = ?`, [id]);
        return rows[0];
    }
    async updateCountry(id, updates) {
        const keys = Object.keys(updates);
        const vals = Object.values(updates);
        const sets = keys.map((k) => `\`${k}\` = ?`).join(', ');
        const sql = `UPDATE countries SET ${sets}, updated_at = NOW() WHERE id = ?`;
        await query(sql, [...vals, id]);
        const { rows } = await query(`SELECT * FROM countries WHERE id = ?`, [id]);
        return rows[0];
    }
    async deleteCountry(id) {
        await query('DELETE FROM countries WHERE id = $1', [id]);
    }
    async getCities(countryId) {
        if (countryId) {
            const { rows } = await query(`SELECT ci.*, JSON_OBJECT('id', co.id, 'name', co.name) AS countries
         FROM cities ci LEFT JOIN countries co ON co.id = ci.country_id
         WHERE ci.country_id = ? ORDER BY ci.name`, [countryId]);
            return rows;
        }
        const { rows } = await query(`SELECT ci.*, JSON_OBJECT('id', co.id, 'name', co.name) AS countries
       FROM cities ci LEFT JOIN countries co ON co.id = ci.country_id
       ORDER BY ci.name`);
        return rows;
    }
    async createCity(data) {
        const id = data.id || crypto.randomUUID();
        const finalData = { ...data, id };
        const cols = Object.keys(finalData);
        const vals = Object.values(finalData);
        const placeholders = cols.map(() => '?').join(', ');
        const sql = `INSERT INTO cities (${cols.join(', ')}) VALUES (${placeholders})`;
        await query(sql, vals);
        const { rows } = await query(`SELECT * FROM cities WHERE id = ?`, [id]);
        return rows[0];
    }
    async updateCity(id, updates) {
        const keys = Object.keys(updates);
        const vals = Object.values(updates);
        const sets = keys.map((k) => `\`${k}\` = ?`).join(', ');
        const sql = `UPDATE cities SET ${sets}, updated_at = NOW() WHERE id = ?`;
        await query(sql, [...vals, id]);
        const { rows } = await query(`SELECT * FROM cities WHERE id = ?`, [id]);
        return rows[0];
    }
    async deleteCity(id) {
        await query('DELETE FROM cities WHERE id = $1', [id]);
    }
    async saveContactRequest(data) {
        const id = crypto.randomUUID();
        const sql = `
      INSERT INTO contact_requests (id, name, email, phone, subject, message, inquiry_type, preferred_contact, newsletter)
      VALUES (?,?,?,?,?,?,?,?,?)
    `;
        await query(sql, [
            id, data.name, data.email, data.phone ?? null,
            data.subject ?? null, data.message,
            data.inquiry_type ?? 'general',
            data.preferred_contact ?? 'email',
            data.newsletter ?? false,
        ]);
        const { rows } = await query(`SELECT * FROM contact_requests WHERE id = ?`, [id]);
        return rows[0];
    }
    async getContactRequests() {
        const { rows } = await query('SELECT * FROM contact_requests ORDER BY created_at DESC');
        return rows;
    }
    async updateContactRequest(id, updates) {
        const keys = Object.keys(updates);
        const vals = Object.values(updates);
        const sets = keys.map((k) => `\`${k}\` = ?`).join(', ');
        const sql = `UPDATE contact_requests SET ${sets} WHERE id = ?`;
        await query(sql, [...vals, id]);
        const { rows } = await query(`SELECT * FROM contact_requests WHERE id = ?`, [id]);
        return rows[0];
    }
    async createBooking(data) {
        const id = crypto.randomUUID();
        const sql = `
      INSERT INTO bookings (id, tour_id, customer_name, customer_email, customer_phone,
                            start_date, end_date, guests, total_amount, special_requests)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `;
        await query(sql, [
            id, data.tour_id, data.customer_name, data.customer_email,
            data.customer_phone ?? null, data.start_date, data.end_date,
            data.guests, data.total_amount, data.special_requests ?? null,
        ]);
        const { rows } = await query(`SELECT * FROM bookings WHERE id = ?`, [id]);
        return rows[0];
    }
    async getBookings() {
        const { rows } = await query(`
      SELECT b.*, t.title AS tour_title
      FROM bookings b
      LEFT JOIN tours t ON t.id = b.tour_id
      ORDER BY b.created_at DESC
    `);
        return rows;
    }
    async getDashboardStats() {
        const [tours, contacts, bookings] = await Promise.all([
            query('SELECT COUNT(*) FROM tours'),
            query("SELECT COUNT(*) FROM contact_requests WHERE status = 'pending'"),
            query('SELECT COUNT(*) FROM bookings'),
        ]);
        return {
            totalTours: parseInt(tours.rows[0].count),
            pendingContacts: parseInt(contacts.rows[0].count),
            totalBookings: parseInt(bookings.rows[0].count),
        };
    }
    _applyFilters(conditions, params, filters, publishedOnly) {
        if (filters.q) {
            params.push(`%${filters.q}%`);
            params.push(`%${filters.q}%`);
            conditions.push(`(t.title LIKE ? OR t.description LIKE ?)`);
        }
        if (filters.country) {
            params.push(filters.country);
            conditions.push(`co.id = $${params.length}`);
        }
        if (filters.city) {
            params.push(filters.city);
            conditions.push(`t.city_id = $${params.length}`);
        }
        if (filters.category) {
            params.push(filters.category);
            conditions.push(`t.category = $${params.length}`);
        }
        if (filters.experience_level) {
            params.push(filters.experience_level);
            conditions.push(`t.difficulty_level = $${params.length}`);
        }
        if (filters.min_price !== undefined) {
            params.push(filters.min_price);
            conditions.push(`t.price >= $${params.length}`);
        }
        if (filters.max_price !== undefined) {
            params.push(filters.max_price);
            conditions.push(`t.price <= $${params.length}`);
        }
        if (filters.featured) {
            conditions.push(`t.featured = true`);
        }
    }
}
export const adminService = new AdminService();
