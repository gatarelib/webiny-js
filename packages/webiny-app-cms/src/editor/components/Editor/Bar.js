// @flow
import React from "react";
import { connect } from "webiny-app-cms/editor/redux";
import { compose, pure } from "recompose";
import { withPlugins } from "webiny-app/components";
import { getUi } from "webiny-app-cms/editor/selectors";
import DefaultEditorBar from "./DefaultEditorBar";

const Bar = pure(({ barPlugins, ...props }) => {
    let pluginBar = null;

    for (let i = 0; i < barPlugins.length; i++) {
        const plugin = barPlugins[i];
        if (plugin.shouldRender(props)) {
            pluginBar = plugin.render();
            break;
        }
    }

    return (
        <React.Fragment>
            <DefaultEditorBar />
            {pluginBar}
        </React.Fragment>
    );
});

const stateToProps = state => {
    return { ...getUi(state) };
};

export default compose(
    connect(stateToProps),
    withPlugins({ type: "cms-editor-bar", prop: "barPlugins" })
)(Bar);
