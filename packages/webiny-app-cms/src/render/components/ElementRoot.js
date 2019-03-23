// @flow
import React from "react";
import { get } from "dot-prop-immutable";
import { isEqual } from "lodash";
import { withPlugins } from "webiny-app/components";

const Node = "div";

const combineClassNames = (...styles) => {
    return styles.filter(s => s !== "" && s !== "css-0").join(" ");
};

class ElementRootBase extends React.Component<*> {
    shouldComponentUpdate(props: Object) {
        return !isEqual(props.element.data, this.props.element.data);
    }

    render() {
        const { plugins, element, style = {}, children, className = null } = this.props;

        const shallowElement = { id: element.id, type: element.type, data: element.data };

        const finalStyle = plugins.styles.reduce((style, pl) => {
            return pl.renderStyle({ element: shallowElement, style });
        }, style);

        const attributes = plugins.attributes.reduce((attributes, pl) => {
            return pl.renderAttributes({ element: shallowElement, attributes });
        }, {});

        const classNames = get(element, "data.settings.className", "");

        const getAllClasses = (...extraClasses) => {
            return [className, ...extraClasses, ...classNames.split(" ")]
                .filter(v => v && v !== "css-0")
                .join(" ");
        };

        if (typeof children === "function") {
            return children({
                getAllClasses,
                combineClassNames,
                elementStyle: finalStyle,
                elementAttributes: attributes,
                customClasses: classNames.split(" ")
            });
        }

        return (
            <Node className={getAllClasses()} style={finalStyle} {...attributes}>
                {children}
            </Node>
        );
    }
}

export const ElementRoot = withPlugins({
    type: { styles: "cms-render-element-style", attributes: "cms-render-element-attributes" }
})(ElementRootBase);
