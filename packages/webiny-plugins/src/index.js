// @flow
import type { PluginType } from "webiny-plugins/types";

const __plugins = {};

const __callbacks = { onRegister: [], onUnregister: [] };

const _register = plugins => {
    for (let i = 0; i < plugins.length; i++) {
        let plugin = plugins[i];
        if (Array.isArray(plugin)) {
            _register(plugin);
            continue;
        }

        const name = plugin._name || plugin.name;
        if (!name) {
            throw Error(`Plugin must have a "name" or "_name" key.`);
        }

        __plugins[name] = plugin;

        __callbacks.onRegister.map(cb => cb(plugin));
    }
};

export const onRegister = (callback: Function) => {
    __callbacks.onRegister.push(callback);
};

export const onUnregister = (callback: Function) => {
    __callbacks.onUnregister.push(callback);
};

export const registerPlugins = (...args: any): void => _register(args);

export const getPlugins = (type: string): Array<PluginType> => {
    const values: Array<PluginType> = (Object.values(__plugins): any);
    return values.filter((plugin: PluginType) => (type ? plugin.type === type : true));
};

export const getPlugin = (name: string): ?PluginType => {
    return __plugins[name];
};

export const unregisterPlugin = (name: string): void => {
    delete __plugins[name];
    __callbacks.onUnregister.map(cb => cb(name));
};
