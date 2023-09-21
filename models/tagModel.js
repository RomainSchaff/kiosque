const db = require('../config/db');

// exports.getAllTags = (callback) => {
//     const sql = 'SELECT * FROM tags'
//     db.query('SELECT * FROM tags', callback);
// }

exports.getAllTags = async () => {
    try {
        const sql = 'SELECT * FROM tags';
        const tags = await db.promise().query(sql);
        return tags[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// exports.getTagById = (id, callback) => {
//     const sql = 'SELECT * FROM tags WHERE id_tag = ?'
//     db.query(sql, [id], callback);
// }

// exports.createTag = (data, callback) => {
//     const sql = 'INSERT INTO tags SET ?'
//     db.query(sql, data, callback);
// }

// exports.deleteTag = (id, callback) => {
//     const sql = 'DELETE FROM tags WHERE tags.id_tag = ?';
//     db.query(sql, [id], callback);
// }

