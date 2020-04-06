const Telegraf = require('telegraf');
const sqlite3 = require('sqlite3').verbose();
const zmq = require("zeromq");

const bot = new Telegraf(process.env.TELEGRAM_BOT_KEY || '1060336780:AAHTn8MWDA4bHK97D4nEJbGPrhiri8ACFpU');
const db = new sqlite3.Database('./moonshot.db'); //Database path
db.run("CREATE TABLE IF NOT EXISTS telegram (id TEXT NOT NULL PRIMARY KEY)");



bot.command('/register', (ctx) => {

    let groupId = null;

    db.all('select id from telegram where id = ?', [ctx.chat.id.toString()], (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows && rows.length) {
            rows.forEach((row) => {
                groupId = row.id;
            });
            return bot.telegram.sendMessage(groupId, 'You have already been registered')
        } else {
            db.run(`insert into telegram(id) VALUES(?)`, [ctx.chat.id.toString()], function (err) {
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

const run = function run() {
        sock = zmq.socket("pull");

    sock.bindSync("tcp://*:80");

    sock.on("message", function (message) {
        db.all('select id from telegram', [], (err, rows) => {
            if (err) {
                throw err;
            }
            if (rows && rows.length) {
                rows.forEach((row) => {
                    let finalStr = '';
                    const msgObj = JSON.parse(message.toString());
                    Object.keys(msgObj).forEach((eachKey) => {
                        finalStr += `<b>${eachKey}</b> : ${msgObj[eachKey]}
`;
                    });
                    bot.telegram.sendMessage(row.id, finalStr, { parse_mode: 'HTML' });
                });
            }
        });
    });
};

run();

bot.launch();


