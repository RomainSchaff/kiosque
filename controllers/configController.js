const ConfigurationModel = require('../models/configurationModel')

// exports.updateAllConfigs = (req, res) => {
//     const { data } = req.body;
//     ConfigurationModel.updateAllConfigs(data, (err, result) => {
//         if (err) return next(err);
//         console.log(result);
//         res.json(result);
//     });
// }

exports.updateConfigurations = (req, res) => {
    const data = req.body;
    console.log("data controller => :", data);
    ConfigurationModel.updateConfigurations(data, (err, result) => {
        if (err) return next(err);
        console.log(result);
        res.json(result);
    })
}