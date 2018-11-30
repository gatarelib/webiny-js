// @flow
import * as React from "react";
import styled from "react-emotion";
import { Menu } from "webiny-app-cms/render/components";
import { Modules } from "webiny-app/components";
import { addPlugin } from "webiny-plugins";
import cookiePolicy from "webiny-cookie-policy/render";

const Banner = styled("div")({
    backgroundColor: "#666",
    width: "100%",
    height: 50
});

type Props = {
    children: React.Node
};

addPlugin(...cookiePolicy);

const Static = ({ children }: Props) => {
    return (
        <div className={"static-page-container"}>
            <Modules />
            <Menu slug={"demo-menu"}>
                {({ data }) => (
                    <ul>
                        {data.items.map(item => (
                            <li key={item.id}>{item.title}</li>
                        ))}
                    </ul>
                )}
            </Menu>
            <Banner />
            {children}
            <Banner />
        </div>
    );
};

export default Static;
