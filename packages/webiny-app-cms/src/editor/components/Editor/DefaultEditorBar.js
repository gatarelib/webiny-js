//@flow
import React from "react";
import { pure } from "recompose";
import { TopAppBar, TopAppBarSection } from "webiny-ui/TopAppBar";
import { Plugins } from "webiny-app/components/Plugins";
import { css } from "emotion";

const topBar = css({
    boxShadow: "1px 0px 5px 0px rgba(128,128,128,1)"
});

const DefaultEditorBar = pure(() => {
    return (
        <TopAppBar className={topBar} fixed>
            <TopAppBarSection style={{ width: "50%" }} alignStart>
                <Plugins type={"cms-default-bar-left"} />
            </TopAppBarSection>

            <TopAppBarSection style={{ width: "33%" }} alignEnd>
                <Plugins type={"cms-default-bar-right"} />
            </TopAppBarSection>
        </TopAppBar>
    );
});

export default DefaultEditorBar;
