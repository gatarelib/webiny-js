// @flow
import React from "react";
import styled from "react-emotion";
import { withPlugins } from "webiny-app/components";

const PluginViewsContainer = styled("div")({
    position: "absolute",
    left: 0,
    top: 64,
    zIndex: 3
});

const PluginViews = ({ plugins }) => {
    return (
        <PluginViewsContainer data-type={"plugin-views-top"}>
            <div style={{ position: "relative" }}>
                {plugins.map(plugin =>
                    React.cloneElement(plugin.renderView(), { key: plugin.name })
                )}
            </div>
        </PluginViewsContainer>
    );
};

export default withPlugins({ type: "cms-toolbar" })(PluginViews);
