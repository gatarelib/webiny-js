// @flow
import React from "react";
import { ApolloProvider } from "react-apollo";
import { router } from "../router";
import { UiProvider } from "./context/ui";
import { Plugins } from "webiny-app/components/plugins";
import { ConfigProvider } from "./context/config";
import { PluginsProvider } from "./context/plugins";

type WebinyProps = { config: Object, children: Function };

const Webiny = ({ config, children }: WebinyProps) => {
    return (
        <Plugins type={"webiny-init"} loading={null}>
            {({ plugins: init }) => {
                init.forEach(plugin => plugin.callback());

                return (
                    <Plugins type={"route"} loading={null}>
                        {({ plugins: routes }) => {
                            // Setup router
                            router.configure(config.router);
                            routes.forEach((pl: Object) => {
                                router.addRoute(pl.route);
                            });

                            return (
                                <ApolloProvider client={config.apolloClient}>
                                    <UiProvider>
                                        <ConfigProvider config={config}>
                                            <PluginsProvider>
                                                {children({ router, config })}
                                            </PluginsProvider>
                                        </ConfigProvider>
                                    </UiProvider>
                                </ApolloProvider>
                            );
                        }}
                    </Plugins>
                );
            }}
        </Plugins>
    );
};

export default Webiny;
