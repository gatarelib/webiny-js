import * as React from "react";
import invariant from "invariant";
import { getPlugin, getPlugins } from "webiny-plugins";
import { CircularProgress } from "webiny-ui/Progress";

const voidLoading = () => null;

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

const renderPlugins = ({ plugins, children, params, filter }) => {
    if (typeof filter === "function") {
        plugins = plugins.filter(filter);
    }

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
};

class LazyPlugins extends React.Component {
    static loaders = {};

    state = {
        plugins: null,
        loading: false
    };

    componentDidMount() {
        this.loadPlugins();
    }

    async loadPlugins() {
        if (this.state.loading) {
            return;
        }

        this.setState({ loading: true });
        const { type } = this.props;
        const cacheKey = typeof type === "string" ? type : JSON.stringify(Object.values(type));

        if (!LazyPlugins.loaders[cacheKey]) {
            LazyPlugins.loaders[cacheKey] = getPlugins(type).then(plugins => {
                console.log("Loaded", cacheKey);
                LazyPlugins.loaders[cacheKey] = null;
                return plugins;
            });
        } else {
            console.log("Reusing loader",cacheKey);
        }
        const plugins = await LazyPlugins.loaders[cacheKey];
        this.setState({ plugins, loading: false });
    }

    render() {
        let { plugins } = this.state;
        if (!plugins) {
            return <CircularProgress />;
        } else {
            return this.props.render(plugins);
        }
    }
}

export const Plugins = ({ type, children, loading, params, filter, once = true }) => {
    invariant(type, "Plugins component requires a `type` prop!");

    console.log("Plugins", type);

    return (
        <LazyPlugins
            once={once}
            type={type}
            render={plugins => {
                return renderPlugins({ plugins, children, params, filter });
            }}
        />
    );
};
