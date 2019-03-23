// @flow
import React from "react";
import { css } from "emotion";
import { Menu } from "webiny-ui/Menu";
import { List } from "webiny-ui/List";
import { Plugin, Plugins } from "webiny-app/components/plugins";
import { TopAppBarActionItem } from "webiny-ui/TopAppBar";

const menuDialog = css({
    "&.mdc-menu": {
        minWidth: 300
    }
});

const UserMenu = () => {
    return (
        <TopAppBarActionItem
            icon={
                <Menu
                    className={menuDialog}
                    anchor={"topEnd"}
                    handle={
                        <menu-handle>
                            <Plugin name={"user-menu-handle"}/>
                        </menu-handle>
                    }
                >
                    <List>
                        <Plugin name={"header-user-menu-user-info"}/>
                        <Plugins type={"header-user-menu"}/>
                    </List>
                </Menu>
            }
        />
    );
};

export default UserMenu;
