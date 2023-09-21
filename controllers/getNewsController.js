const NotificationModel = require('../models/notificationModel');
const ConfigurationModel = require('../models/configurationModel');
const InterfaceModel = require('../models/interfaceModel');

let io;

let message;
let lastNotifId;
let lastConfigs;

//CHECK FOR FIRST CONNECTION
let alreadyConnected = false;

module.exports = {
    init: server => {
        io = require('socket.io')(server);
        io.on('connection', socket => {
            console.log('Client connected');

            //GET CONFIGURATION
            // function getConfigurations() {
            //     return ConfigurationModel.getAllConfigurations();
            // }

            //GET LAST NOTIFICATION
            // function getLastNotif(lastNotifId) {
            //     const lastNotifications = NotificationModel.getLastNotif(lastNotifId);
            //     return lastNotifications;
            // }

            //GET INTERFACE WITH THE ID FIND IN THE NOTIF
            // async function getInterfaceById(currentId) {
            //     const interface = await InterfaceModel.getInterfaceById(currentId);
            //     return interface;
            // }

            //HANDLE SEND NEW THINGS
            async function getNewConfigNotif() {
                let canWeSendDatas = false;

                try {
                    const configurationsResult = await ConfigurationModel.getAllConfigurations();
                    // console.log("configs result", configurationsResult);
                    const notificationsResult = await NotificationModel.getLastNotif(lastNotifId);
                    // console.log("notifs results", notificationsResult);

                    //STORE EVERYTHINGS
                    let dataToSend = {};
                    let notifications = notificationsResult || [];
                    // console.log("notification L50 => :", notifications);
                    let configsFromServer = configurationsResult || [];
                    // console.log("configsFromServer L52 => :", configsFromServer);
                    dataToSend.notifications = notifications;
                    dataToSend.configurations = configsFromServer;

                    //UPDATE LastNotifId
                    if (notifications.length > 0)
                        lastNotifId = notifications[0].id;

                    //HANDLE NOTIF + INTERFACES
                    let index = 0;
                    async function IncrementInterface() {

                        if (notifications.length > 0) {
                            if (index <= (notifications.length - 1)) {
                                let currentId = notifications[index].id_interface;
                                if (currentId != null) {
                                    const interface = await InterfaceModel.getInterfaceById(currentId);
                                    dataToSend.notifications[index].interface = JSON.stringify(interface);
                                    //Increment Index + start again the process
                                    index++;
                                    IncrementInterface();
                                }
                                else {
                                    //Increment Index + start again the process
                                    index++;
                                    IncrementInterface();
                                }
                            } else {
                                canWeSendDatas = true;
                            }
                        }
                    }
                    await IncrementInterface();

                    //HANDLE CONFIGURATIONS
                    function checkIfIsNewConfigurations() {
                        for (let j = 0; j < configsFromServer.length; j++) {
                            for (let i = 0; lastConfigs.length > i; i++) {
                                if (configsFromServer[j].key === lastConfigs[i].key) {

                                    if (configsFromServer[j].value !== lastConfigs[i].value) {
                                        lastConfigs = configsFromServer;
                                        dataToSend.configurations = configsFromServer;
                                        canWeSendDatas = true;
                                        return;
                                    }
                                }
                            }
                            if (j >= configsFromServer.length - 1) {
                                dataToSend.configurations = [];
                            }
                        }
                    }
                    checkIfIsNewConfigurations();

                    console.log('DATA TO SEND : ', dataToSend, canWeSendDatas);

                    //HANDLE SEND DATA
                    if (canWeSendDatas)
                        io.emit("newData", JSON.stringify(dataToSend));

                    //START AGAIN THE PROCESS
                    setTimeout(() => {
                        getNewConfigNotif();
                    }, 15000);
                }
                catch (error) {
                    console.error(error);
                }
            }

            /************** SOCKET EVENTS ************/

            //HANDLE WHEN CLIENT DISCONNECT
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });

            //HANDLE ALL MESSAGES WITH THE CLIENT
            socket.on('client_get_msg', function (msg) {
                console.log('Message from client side: ' + msg);
            });

            socket.on('client_connected', function (msg) {
                console.log('message from client: IN =>' + msg);
                message = JSON.parse(msg) || null;

                //Update variables with last datas
                lastNotifId = message.notifications;
                lastConfigs = message.configurations;

                //Start the process
                if (!alreadyConnected) {
                    getNewConfigNotif();
                    alreadyConnected = true;
                }
            });
        });
        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};