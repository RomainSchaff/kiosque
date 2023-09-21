const db = require('../config/db');

// exports.getAllInterfacesTags = (callback) => {
//     const sql = 'SELECT * FROM interface_tag'
//     db.query(sql, callback);
// }

exports.getAllInterfacesTags = async () => {
    try {
        const sql = 'SELECT * FROM interfaces_tags';
        const interfaceTags = await db.promise().query(sql);
        return interfaceTags[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// exports.getTagsByInterfaceId = (id, callback) => {
//     const sql = 'SELECT * FROM interface_tag WHERE id_int = ?'
//     db.query(sql, [id], callback);
// }

// exports.createInterfaceTag = (data, callback) => {
//     const sql = 'INSERT INTO interface_tag SET ?'
//     db.query(sql, data, callback);
// }

// exports.deleteInterfaceTagByTagId = (id, callback) => {
//     const sql = 'DELETE FROM interface_tag WHERE interface_tag.id_tag = ?';
//     db.query(sql, [id], callback);
// }