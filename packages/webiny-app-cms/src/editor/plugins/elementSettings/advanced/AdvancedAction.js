// @flow
import { compose } from "recompose";
import { connect } from "webiny-app-cms/editor/redux";
import { withPlugins } from "webiny-app/components";
import { getActiveElement } from "webiny-app-cms/editor/selectors";

const AdvancedAction = ({ plugins, elementType, children }: Object) => {
    if (!plugins.some(pl => pl.element === elementType)) {
        return null;
    }

    return children;
};

export default compose(
    connect(state => ({ elementType: getActiveElement(state).type })),
    withPlugins({ type: "cms-element-advanced-settings" })
)(AdvancedAction);
