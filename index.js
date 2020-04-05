// const Telegraf = require('telegraf')
//
// // BOT TOKEN : 1060336780:AAHTn8MWDA4bHK97D4nEJbGPrhiri8ACFpU
//
// const bot = new Telegraf('1060336780:AAHTn8MWDA4bHK97D4nEJbGPrhiri8ACFpU')
// bot.start((ctx) => ctx.reply('Hello'))
// bot.help((ctx) => ctx.reply('Help message'))
// bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message, Extra.markup(keyboard)))
// bot.launch()


const Telegraf = require('telegraf');
const sqlite3 = require('sqlite3').verbose();

// BOT TOKEN : 1060336780:AAHTn8MWDA4bHK97D4nEJbGPrhiri8ACFpU

const bot = new Telegraf('1060336780:AAHTn8MWDA4bHK97D4nEJbGPrhiri8ACFpU');
// bot.start((ctx) => ctx.reply('Hello'))
// bot.help((ctx) => ctx.reply('Help message'))
// bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message, Extra.markup(keyboard)))


bot.command('/register', (ctx) => {

    const db = new sqlite3.Database('./moonshot.db'); //Database path
    db.run("CREATE TABLE IF NOT EXISTS telegram (id TEXT NOT NULL PRIMARY KEY)");

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
            db.close();
            return bot.telegram.sendMessage(groupId, 'You have already been registered')
        } else {
            db.run(`insert into telegram(id) VALUES(?)`, [ctx.chat.id.toString()], function(err) {
                if (err) {
                    throw err.message;
                }
            });
            db.close();
            return bot.telegram.sendMessage(ctx.chat.id, 'Registered')
        }
    });
});


bot.command('/deregister', (ctx) => {
    const db = new sqlite3.Database('./moonshot.db'); //Database path
    db.run('delete from telegram where id = ?', [ctx.chat.id.toString()], (err) => {
        if (err) {
            throw err.message;
        }
        return bot.telegram.sendMessage(ctx.chat.id, 'Deregistered')
    })
});

const run = function run() {
    const zmq = require("zeromq"),
        sock = zmq.socket("sub");

    sock.connect("tcp://192.168.100.2:1234");
    sock.subscribe("experiment");
    console.log("Subscriber connected to port 1234");

    sock.on("message", function (topic, message) {
        console.log(
            topic.toString(),
            message.toString()
        );
        const db = new sqlite3.Database('./moonshot.db'); //Database path
        // let groupId = null;
        db.all('select id from telegram', [], (err, rows) => {
            if (err) {
                throw err;
            }
            console.log('rows', rows);
            if (rows && rows.length) {
                rows.forEach((row) => {
                    let finalStr = '';
                    const msgObj = JSON.parse(message.toString());
                    Object.keys(msgObj).forEach((eachKey) => {
                        finalStr += `<b>${eachKey}</b> : ${msgObj[eachKey]}
`;
                    });
                    bot.telegram.sendMessage(row.id, finalStr, {parse_mode: 'HTML'});
                    console.log(finalStr);
                });
            }
        });
    });
};

run();

bot.launch();


