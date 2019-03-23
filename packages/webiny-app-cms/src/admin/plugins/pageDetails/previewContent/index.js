// @flow
import * as React from "react";
import { Plugins } from "webiny-app/components/plugins";
import type { CmsPageDetailsPluginType, WithPageDetailsProps } from "webiny-app-cms/types";
import { Tab } from "webiny-ui/Tabs";
import styled from "react-emotion";
import { Elevation } from "webiny-ui/Elevation";
import PagePreview from "./PagePreview";
import { CircularProgress } from "webiny-ui/Progress";

const RenderBlock = styled("div")({
    position: "relative",
    zIndex: 0,
    backgroundColor: "var(--mdc-theme-background)",
    height: "100%",
    overflow: "scroll",
    padding: 25
});

export default ([
    {
        name: "cms-page-details-revision-content-preview",
        type: "cms-page-details-revision-content",
        render({ pageDetails, loading }: WithPageDetailsProps) {
            return (
                <Tab label={"Page preview"} disabled={loading}>
                    <RenderBlock>
                        <Elevation z={2}>
                            <div style={{ position: "relative" }}>
                                {loading && <CircularProgress />}
                                <Plugins
                                    type={"cms-page-details-revision-content-preview"}
                                    params={{ pageDetails }}
                                />
                            </div>
                        </Elevation>
                    </RenderBlock>
                </Tab>
            );
        }
    },
    {
        name: "cms-page-details-revision-render",
        type: "cms-page-details-revision-content-preview",
        render({ pageDetails }: WithPageDetailsProps) {
            return <PagePreview pageDetails={pageDetails} />;
        }
    }
]: Array<CmsPageDetailsPluginType>);
