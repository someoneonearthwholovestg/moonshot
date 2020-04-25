/**
 * Send message to registered telegram group
 * @param bot
 * @param db
 * @param message
 * @returns {Promise<void>}
 */
const sendMessage = async (bot, db, message) => {
    try {
        db.all('select id from telegram', [], async (err, rows) => {
            if (err) {
                throw err;
            }
            console.log('rows', rows);
            if (rows && rows.length) {
                const promises = [];
                rows.forEach(async (row) => {
                    let finalStr = '';
                    const msgObj = JSON.parse(message.toString());
                    Object.keys(msgObj).forEach((eachKey) => {
                        finalStr += `<b>${eachKey}</b> : ${msgObj[eachKey]};
`;
                    });
                    console.log(finalStr);
                    promises.push(bot.telegram.sendMessage(row.id, finalStr, {parse_mode: 'HTML'}))
                });
                const res= await Promise.all(promises);
                console.log('res', res);
                return res;
            }
            return null;
        });
    } catch (ex) {
        throw ex;
    }
};


module.exports = {
    sendMessage
};
