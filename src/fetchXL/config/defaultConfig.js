import {CONFIG_OPTION} from './configOptions';
import {LOG_LEVEL} from '../../util/log/logLevels';

const getDefaultConfig = () => ({
    [CONFIG_OPTION.LOG_LEVEL_INTERCEPTOR_START]: LOG_LEVEL.NO_LOGGING,
    [CONFIG_OPTION.LOG_LEVEL_INTERCEPTOR_IN_OUT]: LOG_LEVEL.NO_LOGGING
});

export default getDefaultConfig;