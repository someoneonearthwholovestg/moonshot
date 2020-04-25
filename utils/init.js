const sqlite3 = require('sqlite3').verbose();
const Telegraf = require('telegraf');
const config = require('config');

const initialise = () => {

    const db = new sqlite3.Database('./moonshot.db'); //Database path
    db.run("CREATE TABLE IF NOT EXISTS telegram (id TEXT NOT NULL PRIMARY KEY)");

    const bot = new Telegraf(config.botId);
    console.log(bot, db);

    return {bot, db};
};


module.exports = {
    initialise
} ;