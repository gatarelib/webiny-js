// @flow
import React from "react";
import { getPlugins } from "webiny-plugins";

type Props = {};
type State = {
    ready: boolean
};

export class Addons extends React.Component<Props, State> {
    settings = {};
    plugins = [];

    state = {
        ready: false
    };

    componentMounted = false;

    componentDidMount() {
        this.componentMounted = true;
        this.init().then(() => {
            if (this.componentMounted) {
                this.setState({ ready: true });
            }
        });
    }

    componentWillUnmount() {
        this.componentMounted = false;
    }

    async init() {
        this.plugins = await getPlugins("addon-render");
        for (let i = 0; i < this.plugins.length; i++) {
            let plugin = this.plugins[i];
            this.settings[plugin.name] = {};
            if (plugin.settings) {
                if (typeof plugin.settings === "function") {
                    this.settings[plugin.name] = await plugin.settings();
                } else {
                    this.settings[plugin.name] = plugin.settings;
                }
            }
        }
    }

    render() {
        const { ready } = this.state;
        if (ready) {
            // $FlowFixMe
            return this.plugins.map(plugin => {
                return React.cloneElement(plugin.component, {
                    key: plugin.name,
                    settings: this.settings[plugin.name]
                });
            });
        }

        return null;
    }
}
