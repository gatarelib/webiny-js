import * as React from "react";
import md5 from "md5";
import invariant from "invariant";
import { getPlugin, getPlugins } from "webiny-plugins";
import { PluginsContext } from "webiny-app/components/context/plugins";
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
        let { plugin } = this.state;
        if (!plugin) {
            return <CircularProgress />;
        } else {
            return this.props.render(plugin);
        }
    }
}

export const Plugin = ({ name, children, loading, params }) => {
    return (
        <LazyPlugin
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
    static contextType = PluginsContext;

    state = {
        plugins: null
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

    generateContextChecksum() {
        const { type } = this.props;
        const ctxPlugins = this.context;
        if (!ctxPlugins) {
            return null;
        }

        let plugins = [];

        if (typeof type === "string") {
            plugins = ctxPlugins.filter(pl => type === pl.type);
        } else {
            Object.values(type).forEach(key => {
                plugins = [...plugins, ...ctxPlugins.filter(pl => pl.type === key)];
            });
        }

        // Generate checksum
        return md5(plugins.map(pl => `${pl.name}:${pl.__registrationTime}`).join(";"));
    }

    getPlugins() {
        const { type, filter } = this.props;
        const contextChecksum = this.generateContextChecksum();
        const { checksum, plugins } = this.state;

        if (checksum !== contextChecksum) {
            // Start loading
            getPlugins(type)
                .then(plugins => {
                    if (Array.isArray(plugins) && typeof filter === "function") {
                        return plugins.filter(filter);
                    }
                    return plugins;
                })
                .then(plugins => this.setState({ plugins, checksum: contextChecksum }));
        }

        return plugins;
    }

    render() {
        const { type, loading } = this.props;
        invariant(type, `Plugins component requires a "type" prop!`);

        const plugins = this.getPlugins();
        if (!plugins) {
            return typeof loading === "undefined" ? (
                <CircularProgress />
            ) : typeof loading === "function" ? (
                React.createElement(loading)
            ) : (
                loading
            );
        } else {
            return this.renderPlugins(plugins);
        }
    }
}
