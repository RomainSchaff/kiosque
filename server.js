const express = require('express');
const http = require('http');
const app = express();
const socketController = require('./controllers/getNewsController');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const getAllDatasRoutes = require('./routes/allDatasRoute');
const notificationRoutes = require('./routes/notificationRoute');
const configurationRoutes = require('./routes/configRoute')

// Initialisation de socket.io
socketController.init(server);

// Body-parser
app.use(bodyParser.json());
app.use(cors());

// Client
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render('index');
});

// Routes API
app.use('/api/getAllDatas', getAllDatasRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/configurations', configurationRoutes);

// Lancement du serveur
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});


