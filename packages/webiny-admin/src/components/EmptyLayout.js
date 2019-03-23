// @flow
import * as React from "react";
import { Plugins } from "webiny-app/components/plugins";

export const EmptyLayout = ({ children }: { children: React.Node }) => {
    return <Plugins type={"empty-layout"} params={{ content: children }} />;
};
