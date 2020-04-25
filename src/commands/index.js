// register telegram group
const registerTelegramGroup = async (db, bot, ctx) => {
    let groupId = null;

    db.all('select id from telegram where id = ?', [ctx.chat.id.toString()], async (err, rows) => {
        if (err) {
            throw err;
        }
        console.log('rows', rows);
        const promises = [];
        if (rows && rows.length) {
            rows.forEach((row) => {
                groupId = row.id;
                promises.push(bot.telegram.sendMessage(groupId, 'You have already been registered'));
                console.log(row.id);
            });
            return await Promise.all(promises);
        } else {
            db.run(`insert into telegram(id) VALUES(?)`, [ctx.chat.id.toString()], function (err) {
                if (err) {
                    throw err.message;
                }
                return bot.telegram.sendMessage(ctx.chat.id, 'Registered')
            });
        }
    });
};


// deregister telegram group
const deregisterTelegramGroup = async (db, bot, ctx) => {
    db.run('delete from telegram where id = ?', [ctx.chat.id.toString()], (err) => {
        if (err) {
            throw err.message;
        }
        return bot.telegram.sendMessage(ctx.chat.id, 'Deregistered')
    })
};

module.exports = {
    registerTelegramGroup,
    deregisterTelegramGroup
};






