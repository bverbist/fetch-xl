import {LOG_LEVEL} from './logLevels';
import verify from '../verify';
import is from '../is';

let LOGGER = console;

export const setUnderlyingLogger = (logger) => {
    verify(logger, is.logger, 'Input should at least have a log function.');

    LOGGER = logger;
};

const initLogger = (context, logLevel = LOG_LEVEL.LOG) => {
    return {
        log,
        logGroupStart,
        logGroupMsg,
        logGroupEnd,
        isEnabled
    };

    function log(...toBeLogged) {
        if (!isEnabled()) {
            return;
        }

        try {
            LOGGER[logLevel](context, ...toBeLogged);
        } catch (e) {
            LOGGER.log(context, ...toBeLogged);
        }
    }

    function logGroupMsg(...toBeLogged) {
        if (!isEnabled()) {
            return;
        }

        try {
            LOGGER[logLevel](...toBeLogged);
        } catch (e) {
            LOGGER.log(...toBeLogged);
        }
    }

    function logGroupStart(title, isCollapsed = true) {
        if (!isEnabled()) {
            return;
        }

        try {
            if (isCollapsed) {
                LOGGER.groupCollapsed(`${context} ${title}`);
            } else {
                LOGGER.group(`${context} ${title}`);
            }
        } catch (e) {
            log(logLevel, `-- group ${context} ${title} --`);
        }
    }

    function logGroupEnd() {
        if (!isEnabled()) {
            return;
        }

        try {
            LOGGER.groupEnd();
        } catch (e) {
            log(logLevel, `-- group ${context} end --`);
        }
    }

    function isEnabled() {
        return logLevel !== LOG_LEVEL.NO_LOGGING;
    }
};

export default initLogger;