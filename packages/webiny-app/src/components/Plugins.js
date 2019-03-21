import * as React from "react";
import Loadable from "react-loadable";
import invariant from "invariant";
import { getPlugin, getPlugins } from "webiny-plugins";
import { CircularProgress } from "webiny-ui/Progress";

const voidLoading = () => null;

export const Plugin = ({ name, children, loading, params }) => {
    if (typeof loading === "undefined") {
        loading = CircularProgress;
    }

    const Component = Loadable({
        loader: async () => getPlugin(name),
        loading: loading ? loading : voidLoading,
        render(plugin) {
            if (typeof children === "function") {
                return children({ plugin });
            }

            return plugin["render"](params);
        }
    });

    return <Component />;
};

const loadedPlugins = {};

const renderPlugins = ({ plugins, children, params }) => {
    if (typeof children === "function") {
        return children({ plugins });
    }

    return (
        <>
            {plugins.map(plugin => {
                const content = plugin["render"](params);
                return React.cloneElement(content, { key: plugin.name });
            })}
        </>
    );
};

export const Plugins = ({ type, children, loading, params, once = true }) => {
    if (typeof loading === "undefined") {
        loading = CircularProgress;
    }

    if (once && loadedPlugins[type]) {
        return renderPlugins({ plugins: loadedPlugins[type], children, params });
    }

    invariant(type, "Plugins component requires a `type` prop!");

    const Component = Loadable({
        loader: async () => {
            return (loadedPlugins[type] = await getPlugins(type));
        },
        loading: loading ? loading : voidLoading,
        render(plugins) {
            return renderPlugins({ plugins, children, params });
        }
    });

    return <Component />;
};
