import * as React from "react";
import { getPluginsSync, onRegister, onUnregister } from "webiny-plugins";

export const PluginsContext = React.createContext(getPluginsSync());

export class PluginsProvider extends React.Component {
    state = {
        plugins: getPluginsSync()
    };

    componentDidMount() {
        this.rendering = false;

        onRegister(pls => {
            if (!pls.length) {
                return;
            }

            // This little hack is required to prevent multiple state updates during same render cycle.
            if (!this.rendering) {
                this.setState(state => ({ plugins: [...state.plugins, ...pls] }));
            } else {
                if (Array.isArray(this.nextUpdate)) {
                    this.nextUpdate = [...this.nextUpdate, ...pls];
                } else {
                    this.nextUpdate = [...pls];
                }
            }
        });

        onUnregister(name => {
            const plugins = [...this.state.plugins];
            const index = plugins.findIndex(pl => pl.name === name);
            if (index > -1) {
                plugins.splice(index, 1);
                this.setState({ plugins });
            }
        });
    }

    componentDidUpdate() {
        this.rendering = false;

        // If the `nextUpdate` flag is set, we need to trigger a re-render.
        if (this.nextUpdate) {
            this.setState(state => {
                const newState = { plugins: [...state.plugins, ...this.nextUpdate] };
                this.nextUpdate = null;
                return newState;
            });
        }
    }

    render() {
        this.rendering = true;
        return (
            <PluginsContext.Provider value={this.state.plugins}>
                {this.props.children}
            </PluginsContext.Provider>
        );
    }
}

export const PluginsConsumer = ({ children }) => {
    return (
        <PluginsContext.Consumer>
            {plugins => {
                if (typeof children === "function") {
                    return children(plugins);
                }
                return React.cloneElement(children, { plugins });
            }}
        </PluginsContext.Consumer>
    );
};
