import {DefaultsBuilder} from './DefaultsBuilder';
import {ResourceBuilder} from './ResourceBuilder';
import {newAction} from './ActionBuilder';

const apiConfigurator = () => {
    const defaultsBuilder = new DefaultsBuilder();

    const resource = () => new ResourceBuilder(defaultsBuilder);

    const action = () => newAction(defaultsBuilder);

    return {
        defaults: () => defaultsBuilder,
        resource,
        action
    };
};

export default apiConfigurator;