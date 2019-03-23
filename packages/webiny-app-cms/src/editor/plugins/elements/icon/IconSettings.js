//@flow
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { connect } from "webiny-app-cms/editor/redux";
import { compose, withHandlers } from "recompose";
import { withPlugins } from "webiny-app/components";
import { Tabs, Tab } from "webiny-ui/Tabs";
import { get, set } from "dot-prop-immutable";
import { isEqual } from "lodash";
import { updateElement } from "webiny-app-cms/editor/actions";
import { getActiveElement } from "webiny-app-cms/editor/selectors";
import Input from "webiny-app-cms/editor/plugins/elementSettings/components/Input";
import ColorPicker from "webiny-app-cms/editor/plugins/elementSettings/components/ColorPicker";
import IconPicker from "webiny-app-cms/editor/plugins/elementSettings/components/IconPicker";

type Props = {
    element: Object,
    updateIcon: Function,
    updateWidth: Function,
    updateColor: Function,
    updateColorPreview: Function
};

const IconSettings = (props: Props) => {
    const { element, updateIcon, updateWidth, updateColor, updateColorPreview } = props;
    const { data: { icon = {} } = {} } = element;

    return (
        <React.Fragment>
            <Tabs>
                <Tab label={"Icon"}>
                    <IconPicker label={"Icon"} value={icon.id} updateValue={updateIcon} />
                    <Input label={"Width"} value={icon.width || 50} updateValue={updateWidth} />
                    <ColorPicker
                        label={"Color"}
                        value={icon.color}
                        updateValue={updateColor}
                        updatePreview={updateColorPreview}
                    />
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
        updateSettings: ({ updateElement, element, getSvg }) => {
            const historyUpdated = {};

            return (name, value, history = true) => {
                const attrKey = `data.icon.${name}`;

                let newElement = set(element, attrKey, value);
                const { id, width, color } = get(newElement, "data.icon");
                newElement = set(newElement, "data.icon.svg", getSvg(id, { width, color }));

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
        updateIcon: ({ updateSettings }) => (value: Object) => updateSettings("id", value.id),
        updateColor: ({ updateSettings }) => (value: string) => updateSettings("color", value),
        updateColorPreview: ({ updateSettings }) => (value: string) =>
            updateSettings("color", value, false),
        updateWidth: ({ updateSettings }) => (value: string) => updateSettings("width", value)
    })
)(IconSettings);
