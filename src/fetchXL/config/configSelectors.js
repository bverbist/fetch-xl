import {CONFIG_OPTION} from './configOptions';

export const getLogLevelInterceptorStart = (config) =>
    config[CONFIG_OPTION.LOG_LEVEL_INTERCEPTOR_START];

export const getLogLevelInterceptorInputAndOutput = (config) =>
    config[CONFIG_OPTION.LOG_LEVEL_INTERCEPTOR_IN_OUT];