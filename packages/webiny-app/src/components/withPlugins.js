// @flow
import * as React from "react";
import { Plugins } from "./Plugins";

export type WithPluginsOptions = {
    prop?: string,
    type: string | Object,
    loading?: React.Component<*> | null,
    params?: Object,
    once?: boolean,
    format?: (plugins: Array<Object> | Object) => any
};

export const withPlugins = (options: WithPluginsOptions): Function => {
    return (BaseComponent: typeof React.Component) => {
        return function withPlugins(props: Object) {
            return (
                <Plugins {...options}>
                    {({ plugins }) => {
                        if (typeof options.format === "function") {
                            plugins = options.format(plugins);
                        }

                        return (
                            <BaseComponent
                                {...props}
                                {...{ [options.prop || "plugins"]: plugins }}
                            />
                        );
                    }}
                </Plugins>
            );
        };
    };
};
