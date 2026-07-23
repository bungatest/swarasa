const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Initialize tables
        db.run(`CREATE TABLE IF NOT EXISTS complaints (
            id TEXT PRIMARY KEY,
            title TEXT,
            category TEXT,
            date TEXT,
            schoolName TEXT,
            urgency TEXT,
            rating INTEGER,
            desc TEXT,
            status TEXT,
            vendorReply TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS vendor_status (
            key TEXT PRIMARY KEY,
            value TEXT
        )`, () => {
            // Seed initial data if empty
            db.get("SELECT count(*) as count FROM vendor_status", (err, row) => {
                if (!err && row.count === 0) {
                    db.run("INSERT INTO vendor_status (key, value) VALUES ('status', 'normal')");
                    db.run("INSERT INTO vendor_status (key, value) VALUES ('score', '88')");
                }
            });
        });
    }
});

module.exports = {
    // Complaints
    getAllComplaints: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM complaints", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    addComplaint: (complaint) => {
        return new Promise((resolve, reject) => {
            const { id, title, category, date, schoolName, urgency, rating, desc, status, vendorReply } = complaint;
            db.run(
                `INSERT INTO complaints (id, title, category, date, schoolName, urgency, rating, desc, status, vendorReply) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, title, category, date, schoolName, urgency, rating, desc, status, vendorReply || ''],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, ...complaint });
                }
            );
        });
    },
    updateComplaint: (id, updates) => {
        return new Promise((resolve, reject) => {
            const keys = Object.keys(updates);
            if (keys.length === 0) return resolve();
            
            const setString = keys.map(k => `${k} = ?`).join(', ');
            const values = keys.map(k => updates[k]);
            values.push(id);
            
            db.run(`UPDATE complaints SET ${setString} WHERE id = ?`, values, function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    },
    deleteComplaint: (id) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM complaints WHERE id = ?", [id], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    },
    
    // Vendor Status & Score
    getVendorInfo: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM vendor_status", [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const info = {};
                    rows.forEach(r => info[r.key] = r.value);
                    resolve(info);
                }
            });
        });
    },
    updateVendorInfo: (key, value) => {
        return new Promise((resolve, reject) => {
            db.run("UPDATE vendor_status SET value = ? WHERE key = ?", [value, key], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};
