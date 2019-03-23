// @flow
import React from "react";
import { Menu } from "webiny-ui/Menu";
import { IconButton } from "webiny-ui/Button";
import { ReactComponent as MoreVerticalIcon } from "webiny-app-cms/editor/assets/icons/more_vert.svg";
import { withPlugins } from "webiny-app/components";

const PageOptionsMenu = ({ plugins }) => {
    return (
        <Menu handle={<IconButton icon={<MoreVerticalIcon />} />}>
            {plugins.map(pl => React.cloneElement(pl.render(), { key: pl.name }))}
        </Menu>
    );
};

export default withPlugins({ type: "cms-default-bar-right-page-options-option" })(PageOptionsMenu);
