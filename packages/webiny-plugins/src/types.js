// @flow
export type PluginType = Object & {
    name: string,
    type: string,
    factory?: Promise<Object>
};
