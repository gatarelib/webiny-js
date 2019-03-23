// @flow
import * as React from "react";
import { compose } from "recompose";
import { Grid, Cell } from "webiny-ui/Grid";
import { Input } from "webiny-ui/Input";
import { Select } from "webiny-ui/Select";
import { withCms } from "webiny-app-cms/context";
import { withPlugins } from "webiny-app/components";
import PagesList from "./PagesList";

const PagesListDesignSettings = ({ components, cms: { theme }, Bind, data }: Object) => {
    return (
        <React.Fragment>
            <Grid>
                <Cell span={6}>
                    <Bind
                        name={"component"}
                        defaultValue={components[0] ? components[0].name : null}
                    >
                        <Select
                            label={"Design"}
                            description={"Select a component to render the list"}
                        >
                            {components.map(cmp => (
                                <option key={cmp.name} value={cmp.name}>
                                    {cmp.title}
                                </option>
                            ))}
                        </Select>
                    </Bind>
                </Cell>

                <Cell span={6}>
                    <Bind name={"resultsPerPage"} defaultValue={10} validators={["numeric"]}>
                        <Input label={"Results per page"} />
                    </Bind>
                </Cell>
            </Grid>

            <Grid>
                <Cell span={12} style={{ overflowY: "scroll" }}>
                    <PagesList data={data} theme={theme} />
                </Cell>
            </Grid>
        </React.Fragment>
    );
};

export default compose(
    withCms(),
    withPlugins({ type: "cms-element-pages-list-component", prop: "components" })
)(PagesListDesignSettings);
