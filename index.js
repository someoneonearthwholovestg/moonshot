const Telegraf = require('telegraf')

// BOT TOKEN : 1060336780:AAHTn8MWDA4bHK97D4nEJbGPrhiri8ACFpU

const bot = new Telegraf('1060336780:AAHTn8MWDA4bHK97D4nEJbGPrhiri8ACFpU')
bot.start((ctx) => ctx.reply('Hello'))
bot.help((ctx) => ctx.reply('Help message'))
bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message, Extra.markup(keyboard)))
bot.launch()