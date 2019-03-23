// @flow
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { withPlugins } from "webiny-app/components";
import { connect } from "webiny-app-cms/editor/redux";
import { compose, withHandlers } from "recompose";
import { set } from "dot-prop-immutable";
import { get, isEqual } from "lodash";
import { Tabs, Tab } from "webiny-ui/Tabs";
import { Select } from "webiny-ui/Select";
import { Grid, Cell } from "webiny-ui/Grid";
import { Typography } from "webiny-ui/Typography";
import { withCms } from "webiny-app-cms/context";
import { updateElement } from "webiny-app-cms/editor/actions";
import { getActiveElement } from "webiny-app-cms/editor/selectors";
import Input from "webiny-app-cms/editor/plugins/elementSettings/components/Input";
import ColorPicker from "webiny-app-cms/editor/plugins/elementSettings/components/ColorPicker";
import IconPicker from "webiny-app-cms/editor/plugins/elementSettings/components/IconPicker";

const ButtonSettings = ({
    element,
    cms: { theme },
    updateType,
    updateIcon,
    updateIconColor,
    updateIconColorPreview,
    updateIconWidth,
    updateIconPosition
}: Object) => {
    const { types } = get(theme, "elements.button", []);
    const { type = get(types, "0.name", ""), icon = {} } = get(element, "data", {});

    return (
        <React.Fragment>
            <Tabs>
                <Tab label={"Button"}>
                    <Grid>
                        <Cell span={6}>
                            <Typography use={"overline"}>Type</Typography>
                        </Cell>
                        <Cell span={6}>
                            <Select value={type} onChange={updateType}>
                                {types.map(type => (
                                    <option key={type.className} value={type.className}>
                                        {type.label}
                                    </option>
                                ))}
                            </Select>
                        </Cell>
                    </Grid>
                </Tab>
                <Tab label={"Icon"}>
                    <IconPicker label={"Icon"} value={icon.id} updateValue={updateIcon} />
                    <Input label={"Width"} value={icon.width || 50} updateValue={updateIconWidth} />
                    <ColorPicker
                        label={"Color"}
                        value={icon.color}
                        updateValue={updateIconColor}
                        updatePreview={updateIconColorPreview}
                    />
                    <Grid>
                        <Cell span={6}>
                            <Typography use={"overline"}>Position</Typography>
                        </Cell>
                        <Cell span={6}>
                            <Select value={icon.position || "left"} onChange={updateIconPosition}>
                                <option value={"left"}>Left</option>
                                <option value={"right"}>Right</option>
                                <option value={"top"}>Top</option>
                                <option value={"bottom"}>Bottom</option>
                            </Select>
                        </Cell>
                    </Grid>
                </Tab>
            </Tabs>
        </React.Fragment>
    );
};

export default compose(
    connect(
        state => ({ element: getActiveElement(state) }),
        { updateElement }
    ),
    withCms(),
    withPlugins({
        type: "cms-icons",
        prop: "icons",
        format: plugins => {
            return plugins.reduce((icons: Array<Object>, pl: Object) => {
                return icons.concat(pl.getIcons());
            }, []);
        }
    }),
    withHandlers({
        getSvg: ({ icons }) => (id, props) => {
            if (!props.width) {
                props.width = 50;
            }
            const icon = icons.find(ic => isEqual(ic.id, id));
            return icon ? renderToStaticMarkup(React.cloneElement(icon.svg, props)) : null;
        }
    }),
    withHandlers({
        updateData: ({ updateElement, element, getSvg }) => {
            const historyUpdated = {};

            return (name, value, history = true) => {
                const attrKey = `data.${name}`;

                let newElement = set(element, attrKey, value);
                if (name.startsWith("icon")) {
                    const { id, width, color } = get(newElement, "data.icon");
                    newElement = set(newElement, "data.icon.svg", getSvg(id, { width, color }));
                }

                if (!history) {
                    updateElement({ element: newElement, history });
                    return;
                }

                if (historyUpdated[name] !== value) {
                    historyUpdated[name] = value;
                    updateElement({ element: newElement });
                }
            };
        }
    }),
    withHandlers({
        updateType: ({ updateData }) => (value: Object) => updateData("type", value),
        updateIcon: ({ updateData }) => (value: Object) => updateData("icon.id", value.id),
        updateIconColor: ({ updateData }) => (value: string) => updateData("icon.color", value),
        updateIconColorPreview: ({ updateData }) => (value: string) =>
            updateData("icon.color", value, false),
        updateIconWidth: ({ updateData }) => (value: string) => updateData("icon.width", value),
        updateIconPosition: ({ updateData }) => (value: string) =>
            updateData("icon.position", value)
    })
)(ButtonSettings);
