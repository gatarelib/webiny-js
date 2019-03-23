import * as React from "react";
import { getPluginsSync, onRegister, onUnregister } from "webiny-plugins";

export const PluginsContext = React.createContext();

export class PluginsProvider extends React.Component {
    plugins = getPluginsSync();

    state = {
        ts: null
    };

    timeout = null;

    componentDidMount() {
        onRegister(() => {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                this.plugins = getPluginsSync();
                this.setState({ ts: new Date().getTime() });
            }, 20);
        });

        onUnregister(() => {
            this.plugins = getPluginsSync();
            this.setState({ ts: new Date().getTime() });
        });
    }

    render() {
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
