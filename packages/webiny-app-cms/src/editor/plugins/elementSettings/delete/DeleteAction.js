// @flow
import * as React from "react";
import { connect } from "webiny-app-cms/editor/redux";
import { compose, withHandlers } from "recompose";
import { Plugin } from "webiny-app/components/Plugins";
import { deleteElement } from "webiny-app-cms/editor/actions";
import { getActiveElement } from "webiny-app-cms/editor/selectors";

const DeleteAction = ({ element, children, deleteElement }: Object) => {
    return (
        <Plugin name={element.type}>
            {({ plugin }) => {
                if (typeof plugin.canDelete === "function") {
                    if (!plugin.canDelete({ element })) {
                        return null;
                    }
                }

                return React.cloneElement(children, { onClick: deleteElement });
            }}
        </Plugin>
    );
};

export default compose(
    connect(
        state => ({ element: getActiveElement(state) }),
        { deleteElement }
    ),
    withHandlers({
        deleteElement: ({ deleteElement, element }) => () => {
            deleteElement({ element });
        }
    })
)(DeleteAction);
