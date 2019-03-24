// @flow
import { graphql } from "react-apollo";
import { get } from "dot-prop-immutable";
import { registerPlugins } from "webiny-plugins";
import { listElements } from "webiny-app-cms/admin/graphql/pages";
import createElementPlugin from "./createElementPlugin";
import createBlockPlugin from "./createBlockPlugin";

let elementsAdded = false;

export const withSavedElements = () =>
    graphql(listElements, {
        props: ({ data }) => {
            if (data.loading) {
                return { elements: null };
            }

            const plugins = [];
            const elements = get(data, "cms.elements.data");
            if (!elementsAdded) {
                elements.forEach(el => {
                    if (el.type === "element") {
                        plugins.push(createElementPlugin(el));
                    } else {
                        plugins.push(createBlockPlugin(el));
                    }
                });
                elementsAdded = true;
            }

            registerPlugins(plugins);

            return { elements };
        }
    });
