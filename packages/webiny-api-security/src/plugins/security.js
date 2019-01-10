// @flow
import type { PluginType } from "webiny-plugins/types";
import authenticate from "./authentication/authenticate";
import { getPlugins } from "webiny-plugins";
import { shield } from "graphql-shield";
import { get } from "lodash";
import { type GraphQlSecurityPluginType } from "webiny-api-security/types";

export default ([
    {
        type: "graphql-middleware",
        name: "graphql-middleware-shield",
        middleware: ({ config }) => {
            // If "security.enabled" was set to false, only then we exit.
            if (get(config, "security.enabled") === false) {
                return [];
            }

            const middleware = [];
            getPlugins("graphql").forEach(plugin => {
                const { security } = plugin;
                if (!security) {
                    return true;
                }

                security.shield &&
                    middleware.push(
                        shield(security.shield, {
                            debug: true
                        })
                    );
            });

            return middleware;
        }
    },
    {
        type: "graphql-context-request",
        name: "graphql-context-request-security",
        apply: async args => {
            const securityPlugins: Array<GraphQlSecurityPluginType> = getPlugins(
                "graphql-security"
            );
            for (let i = 0; i < securityPlugins.length; i++) {
                args.context.user = await securityPlugins[i].authenticate(args);
            }
        }
    },
    { type: "graphql-security", name: "security", authenticate }
]: Array<PluginType>);
