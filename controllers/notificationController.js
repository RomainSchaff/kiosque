const NotificationModel = require('../models/notificationModel');

// exports.updateUnseenNotifications = async () => {
//     const updateUnseenNotifications = await NotificationModel.updateUnseenNotifications();
//     return updateUnseenNotifications;
// }

// exports.updateSeenNotifications = async () => {
//     const updateSeenNotifications = await NotificationModel.updateUnseenNotifications();
//     return updateSeenNotifications;
// }

exports.updateToSeenNotifications = (req, res, next) => {
    NotificationModel.updateToSeenNotifications((err, result) => {
        if (err) return next(err);
        console.log(result);
        res.json(result);
    });
}

exports.updateToUnseenNotifications = (req, res, next) => {
    NotificationModel.updateToUnseenNotifications((err, result) => {
        if (err) return next(err);
        console.log(result);
        res.json(result);
    });
}