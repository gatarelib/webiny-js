import * as React from "react";
import { getPluginsSync, onRegister, onUnregister } from "webiny-plugins";

export const PluginsContext = React.createContext();

export class PluginsProvider extends React.Component {
    plugins = getPluginsSync();

    state = {
        ts: null
    };

    componentDidMount() {
        onRegister(pls => {
            if (!pls.length) {
                return;
            }

            this.plugins = getPluginsSync();

            // This little hack is required to prevent multiple state updates during same render cycle.
            // If a render is in progress, we set a `nextUpdate` flag to update the state once it is finished.
            // NOTE 1: we are not using the `state` here, just a plain class property to check in `componentDidUpdate`.
            // NOTE 2: this can be done using `setTimeout`, but I'm afraid we will have serious problems with setTimeout
            // and SSR on Lambda once we get to that, so it's best to stay on the safe side.

            if (!this.rendering) {
                this.setState({ ts: new Date().getTime() });
            } else {
                this.nextUpdate = true;
            }
        });

        onUnregister(() => {
            this.plugins = getPluginsSync();
            this.setState({ ts: new Date().getTime() });
        });
    }

    componentDidUpdate() {
        this.rendering = false;

        // If the `nextUpdate` flag is set, we need to trigger a re-render.
        if (this.nextUpdate) {
            this.setState({ ts: new Date().getTime() });
            this.nextUpdate = null;
        }
    }

    render() {
        this.rendering = true;
        return (
            <PluginsContext.Provider value={this.plugins}>
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
