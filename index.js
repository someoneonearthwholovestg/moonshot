const express = require('express');
const http = require('http');
const redirect = require('express-redirect');
const bodyParser = require('body-parser');
const cors = require('cors');
const Telegraf = require('telegraf');
const {run} = require('./commands/index');

const sqlite3 = require('sqlite3').verbose();

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


const bot = new Telegraf('1060336780:AAHTn8MWDA4bHK97D4nEJbGPrhiri8ACFpU');

const db = new sqlite3.Database('./moonshot.db'); //Database path
db.run("CREATE TABLE IF NOT EXISTS telegram (id TEXT NOT NULL PRIMARY KEY)");

bot.command('/register', (ctx) => {

    let groupId = null;

    db.all('select id from telegram where id = ?', [ctx.chat.id.toString()], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log('rows', rows);
        if (rows && rows.length){
            rows.forEach((row) => {
                groupId = row.id;
                console.log(row.id);
            });
            return bot.telegram.sendMessage(groupId, 'You have already been registered')
        } else {
            db.run(`insert into telegram(id) VALUES(?)`, [ctx.chat.id.toString()], function(err) {
                if (err) {
                    throw err.message;
                }
            });
            return bot.telegram.sendMessage(ctx.chat.id, 'Registered')
        }
    });
});

bot.command('/deregister', (ctx) => {
    db.run('delete from telegram where id = ?', [ctx.chat.id.toString()], (err) => {
        if (err) {
            throw err.message;
        }
        return bot.telegram.sendMessage(ctx.chat.id, 'Deregistered')
    })
});

bot.launch();


app.get('/', (req,res,next) => {
    res.send('Hola People!')
});

app.get('/sendMessage', async (req,res,next) => {
    console.log('req,res', req.query.message);
    try {
        if (req.query && req.query.message){
            console.log(
                req.query.message,
                req.query.message.toString()
            );
            await run(bot, db, req.query.message);
            return res.status(200).send('Message sent')
        }
        return res.status(404).send('No message available')
    } catch (ex) {
        return res.send(ex);
    }
});


server.listen(8000, () => {
    console.log('Server listening at http://%s:%s', 'localhost', 8000);
});





