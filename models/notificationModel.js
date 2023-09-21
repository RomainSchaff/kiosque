const db = require('../config/db');

// exports.getAllNotifications = (callback) => {
//     const sql = '(SELECT * FROM notifications WHERE seen_notif = 0) UNION (SELECT * FROM notifications ORDER BY id_notif DESC LIMIT 10) ORDER BY id_notif DESC;'
//     db.query(sql, callback);
// }

exports.getAllNotifications = async () => {
    try {
        const sql = 'SELECT * FROM notifications ORDER BY id DESC;';
        const notifications = await db.promise().query(sql);
        return notifications[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.updateToSeenNotifications = (callback) => {
    const sql = 'UPDATE notifications SET seen = 1 WHERE seen = 0;';
    db.query(sql, callback);
}

exports.updateToUnseenNotifications = (callback) => {
    const sql = 'UPDATE notifications SET seen = 0 WHERE seen = 1;';
    db.query(sql, callback);
}

// exports.updateToUnseenNotifications = async () => {
//     try {
//         const sql = 'UPDATE notifications SET seen = 1 WHERE seen = 0;';
//         const seenNotif = await db.promise().query(sql, {
//             returnResults: true
//         });
//         return seenNotif.affectedRows;
//     } catch (err) {
//         throw new Error(err.message)
//     }
// }

// exports.updateToSeenNotifications = async () => {
//     try {
//         const sql = 'UPDATE notifications SET seen = 0 WHERE seen = 1;';
//         const unseenNotif = await db.promise().query(sql, {
//             returnResults: true
//         });
//         return unseenNotif.affectedRows;
//     } catch (err) {
//         throw new Error(err.message)
//     }
// }

// exports.deleteNotification = (id, callback) => {
//     const sql = 'DELETE FROM notifications WHERE notifications.id_notif = ?';
//     db.query(sql, [id], callback);
// }

// exports.getLastNotif = (id, callback) => {
//     const sql = `SELECT * FROM notifications WHERE notifications.id_notif > ${id} ORDER BY notifications.id_notif DESC
//   `;
//     db.query(sql, callback);
// }

exports.getLastNotif = async (id) => {
    try {
        const sql = `SELECT * FROM notifications WHERE notifications.id > ${id} ORDER BY notifications.id DESC`;
        const notifications = await db.promise().query(sql, id);
        return notifications[0];
    } catch (err) {
        throw new Error(err.message);
    }
};


