const run = async (bot, db, message) => {
    try {
        db.all('select id from telegram', [], (err, rows) => {
            if (err) {
                throw err;
            }
            console.log('rows', rows);
            if (rows && rows.length) {
                rows.forEach(async (row) => {
                    let finalStr = '';
                    const msgObj = JSON.parse(message.toString());
                    Object.keys(msgObj).forEach((eachKey) => {
                        finalStr += `<b>${eachKey}</b> : ${msgObj[eachKey]};
`;
                    });
                    await bot.telegram.sendMessage(row.id, finalStr, {parse_mode: 'HTML'});
                    console.log(finalStr);
                });
            }
        });
    } catch (ex) {
        throw ex;
    }
};

module.exports = {
    run
};



// const run = function run() {
//     const zmq = require("zeromq"),
//         sock = zmq.socket("pull");
//
//     sock.bindSync("tcp://192.168.100.21:1234");
//     // sock.subscribe("experiment");
//     console.log("Subscriber connected to port 1234");
//
//     sock.on("message", function (message) {
//         console.log(
//             message,
//             message.toString()
//         );
//         db.all('select id from telegram', [], (err, rows) => {
//             if (err) {
//                 throw err;
//             }
//             console.log('rows', rows);
//             if (rows && rows.length) {
//                 rows.forEach((row) => {
//                     let finalStr = '';
//                     const msgObj = JSON.parse(message.toString());
//                     Object.keys(msgObj).forEach((eachKey) => {
//                         finalStr += `<b>${eachKey}</b> : ${msgObj[eachKey]}
// `;
//                     });
//                     bot.telegram.sendMessage(row.id, finalStr, {parse_mode: 'HTML'});
//                     console.log(finalStr);
//                 });
//             }
//         });
//     });
// };



