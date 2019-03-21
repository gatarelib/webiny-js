// @flow
import * as React from "react";
import { Plugins } from "./Plugins";

export const withPlugins = (options: Object): Function => {
    return (BaseComponent: typeof React.Component) => {
        return function withPlugins(props: Object) {
            return (
                <Plugins {...options}>
                    {({ plugins }) => {
                        return <BaseComponent {...props} plugins={plugins} />;
                    }}
                </Plugins>
            );
        };
    };
};
