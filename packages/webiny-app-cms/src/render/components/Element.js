//@flow
import { compose } from "recompose";
import { withPlugins } from "webiny-app/components";
import { withCms } from "webiny-app-cms/context";
import type { ElementType } from "webiny-app-cms/types";

declare type ElementProps = Object & {
    element: ElementType,
    cms: Object
};

const Element = ({ plugins, element, cms: { theme } }: ElementProps) => {
    if (!element) {
        return null;
    }

    const plugin = plugins.find(pl => pl.element === element.type);

    if (!plugin) {
        return null;
    }

    return plugin.render({ theme, element });
};

export default compose(withCms(), withPlugins({ type: "cms-render-element"}))(Element);
