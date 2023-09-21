const db = require('../config/db');

// exports.getAllInterfaces = (callback) => {
//     const sql = 'SELECT * FROM interfaces'
//     db.query(sql, callback);
// };

exports.getAllInterfaces = async () => {
    try {
        const sql = 'SELECT * FROM interfaces ORDER BY id DESC;';
        const interfaces = await db.promise().query(sql);
        return interfaces[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// exports.getInterfaceById = (id, callback) => {
//     const sql = 'SELECT * FROM interfaces WHERE id_int = ?'
//     db.query(sql, [id], callback);
// };

exports.getInterfaceById = async (id) => {
    try {
        const sql = `SELECT * FROM interfaces WHERE id = ${id}`;
        const interfaces = await db.promise().query(sql);
        return interfaces[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// exports.createInterface = (data, callback) => {
//     const sql = 'INSERT INTO interfaces SET ?'
//     db.query(sql, data, callback);
// };

// exports.deleteInterface = (id, callback) => {
//     const sql = 'DELETE FROM interfaces WHERE interfaces.id_int = ?';
//     db.query(sql, [id], callback);
// };