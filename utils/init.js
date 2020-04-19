const Telegraf = require('telegraf');

const sqlite3 = require('sqlite3').verbose();

const initCommand = () => {
    console.log('hello');
    const bot = new Telegraf('1060336780:AAHTn8MWDA4bHK97D4nEJbGPrhiri8ACFpU');

    const db = new sqlite3.Database('../moonshot.db'); //Database path
    db.run("CREATE TABLE IF NOT EXISTS telegram (id TEXT NOT NULL PRIMARY KEY)");
    bot.launch();
};


module.exports = {
    initCommand
} ;