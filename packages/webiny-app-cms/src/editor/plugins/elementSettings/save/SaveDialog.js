// @flow
import React from "react";
import { compose, shouldUpdate } from "recompose";
import { css } from "emotion";
import { withPlugins } from "webiny-app/components";
import ElementPreview from "./SaveDialog/ElementPreview";

import {
    Dialog,
    DialogHeader,
    DialogHeaderTitle,
    DialogBody,
    DialogFooter,
    DialogFooterButton,
    DialogCancel
} from "webiny-ui/Dialog";
import { Input } from "webiny-ui/Input";
import { Switch } from "webiny-ui/Switch";
import { Select } from "webiny-ui/Select";
import { Grid, Cell } from "webiny-ui/Grid";
import { Form } from "webiny-form";
import styled from "react-emotion";

const narrowDialog = css({
    ".mdc-dialog__surface": {
        width: 600,
        minWidth: 600
    }
});

const PreviewBox = styled("div")({
    width: 500,
    minHeight: 250,
    border: "1px solid var(--mdc-theme-on-background)",
    backgroundColor: "#fff", // this must always be white
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    img: {
        maxHeight: 500,
        maxWidth: 500
    }
});

type Props = {
    open: boolean,
    onClose: Function,
    onSubmit: Function,
    element: Object,
    type: string,
    blockCategories: Array<Object>
};

const SaveDialog = (props: Props) => {
    const { element, open, onClose, onSubmit, type, blockCategories } = props;

    return (
        <Dialog open={open} onClose={onClose} className={narrowDialog}>
            <Form onSubmit={onSubmit} data={{ type, category: "cms-block-category-general" }}>
                {({ data, submit, Bind }) => (
                    <React.Fragment>
                        <DialogHeader>
                            <DialogHeaderTitle>Save {type}</DialogHeaderTitle>
                        </DialogHeader>
                        <DialogBody>
                            {element.source && (
                                <Grid>
                                    <Cell span={12}>
                                        <Bind name="overwrite">
                                            <Switch label="Update existing" />
                                        </Bind>
                                    </Cell>
                                </Grid>
                            )}
                            {!data.overwrite && (
                                <Grid>
                                    <Cell span={12}>
                                        <Bind name={"name"} validators={"required"}>
                                            <Input label={"Name"} autoFocus />
                                        </Bind>
                                    </Cell>
                                </Grid>
                            )}
                            {data.type === "block" && !data.overwrite && (
                                <>
                                    <Grid>
                                        <Cell span={12}>
                                            <Bind name="category" validators={["required"]}>
                                                <Select
                                                    label="Category"
                                                    description="Select a block category"
                                                    options={blockCategories}
                                                />
                                            </Bind>
                                        </Cell>
                                    </Grid>
                                </>
                            )}
                            <Grid>
                                <Cell span={12}>
                                    <PreviewBox>
                                        <Bind name={"preview"}>
                                            {({ value, onChange }) =>
                                                value ? (
                                                    <img src={value} alt={""} />
                                                ) : open ? (
                                                    <ElementPreview
                                                        key={element.id}
                                                        onChange={onChange}
                                                        element={element}
                                                    />
                                                ) : null
                                            }
                                        </Bind>
                                    </PreviewBox>
                                </Cell>
                            </Grid>
                        </DialogBody>
                        <DialogFooter>
                            <DialogCancel>Cancel</DialogCancel>
                            <DialogFooterButton onClick={submit}>Save</DialogFooterButton>
                        </DialogFooter>
                    </React.Fragment>
                )}
            </Form>
        </Dialog>
    );
};

export default compose(
    shouldUpdate((props, nextProps) => {
        return props.open !== nextProps.open;
    }),
    withPlugins({
        type: "cms-block-category",
        prop: "blockCategories",
        format: plugins => {
            return plugins.map((item: Object) => ({
                value: item.name,
                label: item.title
            }));
        }
    })
)(SaveDialog);
