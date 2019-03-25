import * as React from "react";
import md5 from "md5";
import invariant from "invariant";
import { getPlugin, getPlugins } from "webiny-plugins";
import { PluginsConsumer } from "webiny-app/components/context/plugins";
import { CircularProgress } from "webiny-ui/Progress";

class LazyPlugin extends React.Component {
    state = {
        plugin: null
    };

    async componentDidMount() {
        const plugin = await getPlugin(this.props.name);
        this.setState({ plugin });
    }

    render() {
        const { loading } = this.props;
        let { plugin } = this.state;
        if (!plugin) {
            return typeof loading === "undefined" ? (
                <CircularProgress />
            ) : typeof loading === "function" ? (
                React.createElement(loading)
            ) : (
                loading
            );
        }
        return this.props.render(plugin);
    }
}

export const Plugin = ({ name, children, loading, params }) => {
    return (
        <LazyPlugin
            loading={loading}
            name={name}
            render={plugin => {
                if (typeof children === "function") {
                    return children({ plugin });
                }

                return plugin["render"](params);
            }}
        />
    );
};

export class Plugins extends React.Component {
    cache = {};

    state = {
        checksum: null
    };

    renderPlugins(plugins) {
        const { children, params } = this.props;

        if (typeof children === "function") {
            return children({ plugins });
        }

        return (
            <>
                {plugins.map(plugin => {
                    const content = plugin["render"](params);
                    return content ? React.cloneElement(content, { key: plugin.name }) : null;
                })}
            </>
        );
    }

    generateContextChecksum(ctxPlugins) {
        if (!ctxPlugins) {
            return null;
        }

        const { type } = this.props;
        let plugins = [];

        if (typeof type === "string") {
            plugins = ctxPlugins.filter(pl => {
                return pl.type === type;
            });
        } else {
            Object.values(type).forEach(key => {
                plugins = [...plugins, ...ctxPlugins.filter(pl => pl.type === key)];
            });
        }

        // Generate checksum
        return md5(
            `${JSON.stringify(type)};` +
                plugins.map(pl => `${pl.name}:${pl.__registrationTime}`).join(";")
        );
    }

    getPlugins(ctxPlugins) {
        const { type, filter } = this.props;

        // For async plugins we utilize local caching to avoid async
        // rendering when plugins do not change across renders.
        const contextChecksum = this.generateContextChecksum(ctxPlugins);

        if (!this.cache[contextChecksum]) {
            // Start loading and do not await results.
            getPlugins(type).then(plugins => {
                this.cache[contextChecksum] = plugins;
                this.setState({ checksum: contextChecksum });
            });
        }

        const { checksum } = this.state;
        const plugins = checksum ? this.cache[checksum] : null;
        if (plugins) {
            if (Array.isArray(plugins) && typeof filter === "function") {
                return plugins.filter(filter);
            }

            return plugins;
        }

        return null;
    }

    render() {
        const { type, loading, sync } = this.props;
        invariant(type, `Plugins component requires a "type" prop!`);

        return (
            <PluginsConsumer>
                {ctxPlugins => {
                    const plugins = this.getPlugins(ctxPlugins || [], { sync });

                    if (!plugins) {
                        return typeof loading === "undefined" ? (
                            <CircularProgress />
                        ) : typeof loading === "function" ? (
                            React.createElement(loading)
                        ) : (
                            loading
                        );
                    }

                    return this.renderPlugins(plugins);
                }}
            </PluginsConsumer>
        );
    }
}

window.Plugins = Plugins;
