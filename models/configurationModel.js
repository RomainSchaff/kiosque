const db = require('../config/db');

// exports.getAllConfigurations = (callback) => {
//     const sql = 'SELECT * FROM configurations'
//     db.query(sql, callback);
// }

exports.getAllConfigurations = async () => {
    try {
        const sql = 'SELECT * FROM configurations';
        const configurations = await db.promise().query(sql);
        return configurations[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// exports.getConfigurationById = (id, callback) => {
//     const sql = 'SELECT * FROM configurations WHERE id_config = ?'
//     db.query(sql, [id], callback);
// }

// exports.createConfiguration = (data, callback) => {
//     const sql = 'INSERT INTO configurations SET ?'
//     db.query(sql, data, callback);
// }

// exports.deleteConfiguration = (id, callback) => {
//     const sql = 'DELETE FROM configurations WHERE configurations.id = ?';
//     db.query(sql, [id], callback);
// }

// exports.updateConfigurations = (callback) => {
//     const sql = `UPDATES configurations SET value_configurations ?`
//     db.query(sql, data, callback);
// }

exports.updateConfigurations = async (data) => {
    console.log("model configurations ", data);
    const { value, key } = data;
    console.log("value et key", value, key);

    const sql = `UPDATE configurations SET value="Rom1" WHERE key = '${data.key}' `;
    const configurations = await db.promise().query(sql);

    return configurations[0];
};