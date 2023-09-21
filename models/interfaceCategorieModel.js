const db = require('../config/db');

// exports.getAllInterfacesCategories = (callback) => {
//     const sql = 'SELECT * FROM interface_categorie'
//     db.query(sql, callback);
// }

exports.getAllInterfacesCategories = async () => {
    try {
        const sql = 'SELECT * FROM interfaces_categories';
        const interfaceCategories = await db.promise().query(sql);
        return interfaceCategories[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// exports.getCategoriesByInterfaceId = (id, callback) => {
//     const sql = 'SELECT * FROM interface_categorie WHERE id_int = ?'
//     db.query(sql, [id], callback);
// }

// exports.createInterfaceCategorie = (data, callback) => {
//     const sql = 'INSERT INTO interface_categorie SET ?'
//     db.query(sql, data, callback);
// }

// exports.deleteInterfaceCatByInterfaceId = (id, callback) => {
//     const sql = 'DELETE FROM interface_categorie WHERE interface_categorie.id_int = ?';
//     db.query(sql, [id], callback);
// }