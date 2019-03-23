// @flow
import type { GraphQLContextPluginType, EntityPluginType } from "webiny-api/types";
import { getPlugins } from "webiny-plugins";

const graphqlContextEntities: GraphQLContextPluginType = {
    name: "graphql-context-entities",
    type: "graphql-context",
    async apply(context) {
        const entityPlugins = await getPlugins("entity");
        entityPlugins.forEach((plugin: EntityPluginType) => {
            if (!context[plugin.namespace]) {
                context[plugin.namespace] = {
                    entities: {}
                };
            }

            const { name, factory } = plugin.entity;
            context[plugin.namespace].entities[name] = factory(context);
        });
    }
};

export default graphqlContextEntities;
