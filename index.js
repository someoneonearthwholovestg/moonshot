const express = require('express');
const http = require('http');
const config = require('config');
const redirect = require('express-redirect');
const bodyParser = require('body-parser');
const cors = require('cors');
const {initialise} = require('./utils/init');
const {pipelineRoutes} = require('./routes/pipeline_routes');
const {botRoutes} = require('./routes/bot_routes');


const router = express.Router();
const app = express();
redirect(app);

const server = http.createServer(app);
server.setTimeout(600000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(cors());
app.use(router);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, '
        + 'Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization');

    return next();
});

const {bot,db} = initialise();

pipelineRoutes(app, bot, db);
botRoutes(bot, db);

bot.launch();

server.listen(config.port, () => {
    console.log('Server listening at http://%s:%s', config.host, config.port);
});





