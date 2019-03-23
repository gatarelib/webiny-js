// @flow
import * as React from "react";
import { Plugins } from "webiny-app/components/plugins";
import type { CmsPageDetailsPluginType, WithPageDetailsProps } from "webiny-app-cms/types";
import { Tabs } from "webiny-ui/Tabs";

export default ({
    name: "cms-page-details-revision-content",
    type: "cms-page-details",
    render({ pageDetails, ...rest }: WithPageDetailsProps) {
        return (
            <Plugins type={"cms-page-details-revision-content"}>
                {({ plugins }) => (
                    <Tabs>
                        {plugins.map(pl =>
                            React.cloneElement(pl.render({ pageDetails, ...rest }), {
                                key: pl.name
                            })
                        )}
                    </Tabs>
                )}
            </Plugins>
        );
    }
}: CmsPageDetailsPluginType);
