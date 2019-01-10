// @flow
import type { PluginType } from "webiny-plugins/types";

export type GraphQlSecurityPluginType = PluginType & {
    authentication: ({ context: Object }) => Object
};
