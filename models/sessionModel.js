const db = require('../config/db');

// exports.getAllSessions = (callback) => {
//     const sql = 'SELECT * FROM sessions'
//     db.query(sql, callback);
// }

exports.getAllSessions = async () => {
    try {
        const sql = 'SELECT * FROM sessions';
        const sessions = await db.promise().query(sql);
        return sessions[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.getSessionById = (id, callback) => {
    const sql = 'SELECT * FROM sessions WHERE id = ?'
    db.query(sql, [id], callback);
}

// exports.createSession = (data, callback) => {
//     const sql = 'INSERT INTO sessions SET ?'
//     db.query(sql, data, callback);
// }

// exports.deleteSession = (id, callback) => {
//     const sql = 'DELETE FROM sessions WHERE sessions.id_session = ?';
//     db.query(sql, [id], callback);
// }

