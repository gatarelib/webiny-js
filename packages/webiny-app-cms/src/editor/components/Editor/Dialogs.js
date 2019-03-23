// @flow
import React from "react";
import { compose, pure } from "recompose";
import { withPlugins } from "webiny-app/components";
import styled from "react-emotion";

const DialogsContainer = styled("div")({
    position: "fixed",
    zIndex: 5
});

const Dialogs = pure(({ plugins }) => {
    const actions = [...plugins.top, ...plugins.bottom];

    return (
        <DialogsContainer data-type={"dialogs"}>
            {actions.map(plugin =>
                typeof plugin.renderDialog === "function"
                    ? React.cloneElement(plugin.renderDialog(), { key: plugin.name })
                    : null
            )}
        </DialogsContainer>
    );
});

export default compose(
    withPlugins({ type: { top: "cms-toolbar-top", bottom: "cms-toolbar-bottom" } })
)(Dialogs);
