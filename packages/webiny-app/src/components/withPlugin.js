// @flow
import * as React from "react";
import { Plugin } from "./plugins";

export const withPlugin = (options: Object): Function => {
    return (BaseComponent: typeof React.Component) => {
        return function withPlugin(props: Object) {
            return (
                <Plugin {...options}>
                    {({ plugin }) => {
                        return <BaseComponent {...props} plugin={plugin} />;
                    }}
                </Plugin>
            );
        };
    };
};
