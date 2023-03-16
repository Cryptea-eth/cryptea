import { getLogger, configure } from 'log4js';

configure({
    appenders: {
        app: { type: 'file', filename: 'logs/app.log' }
    },
    categories: {
        default: { appenders: ['app'], level: 'error' }
        
    }
});

const logger = getLogger();

export default logger;