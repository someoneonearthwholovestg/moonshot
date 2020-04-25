const {sendMessage} = require('../src/pipeline_routes/index');

/**
 * Routes related ML pipeline
 * @param app
 * @param bot
 * @param db
 * @returns {Promise<void>}
 */
const pipelineRoutes = async (app, bot, db) => {
    app.get('/', (req,res,next) => {
        res.send('Hola People!')
    });

    app.get('/sendMessage', async (req,res,next) => {
        console.log('req,res', req.query.message);
        try {
            if (req.query && req.query.message){
                const resMessage = await sendMessage(bot, db, req.query.message);
                if (resMessage){
                    console.log(resMessage, 'mww');
                    return res.status(200).send('Message sent')
                }
                return res.status(200).send('No registered telegram groups for sending messages')
            }
            return res.status(404).send('No message available')
        } catch (ex) {
            return res.send(ex);
        }
    });
};


module.exports = {
    pipelineRoutes
};