// @flow
import React from "react";
import { ApolloProvider } from "react-apollo";
import { router } from "../router";
import { UiProvider } from "./Ui";
import { Plugins } from "webiny-app/components/Plugins";

type WebinyProps = { config: Object, children: Function };

const { Provider, Consumer } = React.createContext();

export const ConfigProvider = ({ config, children }: Object) => {
    return <Provider value={config}>{children}</Provider>;
};

export const ConfigConsumer = ({ children }: Object) => (
    <Consumer>{config => React.cloneElement(children, { config })}</Consumer>
);

const Webiny = ({ config, children }: WebinyProps) => {
    return (
        <Plugins type={{ init: "webiny-init", routes: "route" }} loading={null}>
            {({ plugins: { init, routes } }) => {
                init.forEach(plugin => {
                    plugin.callback();
                });

                // Setup router
                router.configure(config.router);
                routes.forEach((pl: Object) => {
                    router.addRoute(pl.route);
                });

                return (
                    <ApolloProvider client={config.apolloClient}>
                        <UiProvider>
                            <ConfigProvider config={config}>
                                {children({ router, config })}
                            </ConfigProvider>
                        </UiProvider>
                    </ApolloProvider>
                );
            }}
        </Plugins>
    );
};

export default Webiny;
