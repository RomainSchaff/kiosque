const db = require('../config/db');

// exports.getAllCategories = (callback) => {
//     const sql = 'SELECT * FROM categories'
//     db.query(sql, callback);
// }

exports.getAllCategories = async () => {
    try {
        const sql = 'SELECT * FROM categories';
        const categories = await db.promise().query(sql);
        return categories[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// exports.getCategorieById = (id, callback) => {
//     const sql = 'SELECT * FROM categories WHERE id_cat = ?'
//     db.query(sql, [id], callback);
// }

// exports.createCategorie = (data, callback) => {
//     const sql = 'INSERT INTO categories SET ?'
//     db.query(sql, data, callback);
// }

// exports.deleteCategorie = (id, callback) => {
//     const sql = 'DELETE FROM categories WHERE categories.id_cat = ?';
//     db.query(sql, [id], callback);
// }

