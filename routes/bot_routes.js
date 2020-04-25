const {registerTelegramGroup,
    deregisterTelegramGroup} = require('../src/commands/index');

/**
 * Bot commands
 * @param bot
 * @param db
 * @returns {Promise<void>}
 */
const botRoutes = async (bot, db) => {
    bot.command('/register', (ctx) => {
        return registerTelegramGroup(db, bot, ctx);
    });

    bot.command('/deregister', (ctx) => {
        return deregisterTelegramGroup(db, bot, ctx)
    });
};


module.exports = {
    botRoutes
};