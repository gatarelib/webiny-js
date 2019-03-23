// @flow
import type { PluginType } from "webiny-plugins/types";

const _plugins = {};
const _loaded = {};
const _initialized = {};
const _callbacks = { onRegister: [], onUnregister: [] };

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

        plugin._registrationTime = new Date().getTime();

        _plugins[name] = plugin;
        _loaded[name] = !plugin.factory;

        _callbacks.onRegister.map(cb => cb(plugin));
    }
};

export const registerPlugins = (...args: any): void => _register(args);

export const onRegister = (callback: Function) => {
    _callbacks.onRegister.push(callback);
};

export const onUnregister = (callback: Function) => {
    _callbacks.onUnregister.push(callback);
};

export const getPlugins = async (type: string | Object): Promise<Array<PluginType>> => {
    const values: Array<PluginType> = (Object.values(_plugins): any);

    if (typeof type === "string") {
        const plugins = values.filter((plugin: PluginType) => (type ? plugin.type === type : true));

        const loaded = await Promise.all(plugins.map(pl => getPlugin(pl.name)));

        return [...loaded.filter(Boolean)];
    }

    const loaded: Object = {};
    await Promise.all(
        Object.keys(type).map(async name => {
            // $FlowFixMe
            loaded[name] = await getPlugins(type[name]);
        })
    );

    return loaded;
};

export const getPluginsSync = (type: string): Array<PluginType> => {
    const values: Array<PluginType> = (Object.values(_plugins): any);
    return values.filter((plugin: PluginType) => (type ? plugin.type === type : true));
};

export const getPluginSync = (name: string): PluginType => {
    return _plugins[name];
};

export const getPlugin = async (name: string): Promise<PluginType | null> => {
    if (!_plugins[name]) {
        return null;
    }

    if (!_loaded[name]) {
        const loaded = await _plugins[name].factory();
        _plugins[name] = { ..._plugins[name], ...(loaded || {}) };
        _loaded[name] = true;
    }

    if (_plugins[name].init && !_initialized[name]) {
        _plugins[name].init();
        _initialized[name] = true;
    }

    return _plugins[name];
};

export const getPluginSync = (name: string): PluginType | null => {
    if (!__plugins[name]) {
        return null;
    }

    if (!__loaded[name]) {
        const loaded = __plugins[name].factory();
        __plugins[name] = { ...__plugins[name], ...loaded };
        __loaded[name] = true;
    }
    return __plugins[name];
};

export const unregisterPlugin = (name: string): void => {
    delete _plugins[name];
    _callbacks.onUnregister.map(cb => cb(name));
};
