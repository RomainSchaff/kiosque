const InterfaceModel = require('../models/interfaceModel');
const CategorieModel = require('../models/categorieModel');
const ConfigurationModel = require('../models/configurationModel');
const NotificationModel = require('../models/notificationModel');
const SessionModel = require('../models/sessionModel');
const InterfaceCategorieModel = require('../models/interfaceCategorieModel');
const InterfaceTagModel = require('../models/interfaceTagModel');
const TagModel = require('../models/tagModel');

exports.getAllDatas = async (req, res, next) => {
    try {
        const interfaces = await InterfaceModel.getAllInterfaces();
        const configurations = await ConfigurationModel.getAllConfigurations();
        const categories = await CategorieModel.getAllCategories();
        const tags = await TagModel.getAllTags();
        const notifications = await NotificationModel.getAllNotifications();
        const sessions = await SessionModel.getAllSessions();
        const interfaceCategories = await InterfaceCategorieModel.getAllInterfacesCategories();
        const interfaceTags = await InterfaceTagModel.getAllInterfacesTags();

        const consolidatedResult = {
            interfaces,
            configurations,
            categories,
            tags,
            notifications,
            sessions,
        };

        // Créer une clé "categories" pour chaque interface
        consolidatedResult.interfaces.forEach(interf => {
            interf.categories = [];
            interfaceCategories.forEach(ic => {
                if (ic.id_interface === interf.id) {
                    const category = categories.find(cat => cat.id === ic.id_categorie);
                    if (category) {
                        interf.categories.push(category.name);
                    }
                }
            });
        });

        // Créer une clé "tags" pour chaque interface
        consolidatedResult.interfaces.forEach(interf => {
            interf.tags = [];
            interfaceTags.forEach(it => {
                if (it.id_interface === interf.id) {
                    const tag = tags.find(t => t.id === it.id_tag);
                    if (tag) {
                        interf.tags.push(tag.name);
                    }
                }
            });
        });
        res.status(200).json(consolidatedResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};