// @flow
import React from "react";
import { compose } from "recompose";
import { Editor } from "slate-react";
import { Value } from "slate";
import { withPlugins } from "webiny-app/components";
import { withCms } from "webiny-app-cms/context";

class SlateEditor extends React.Component<*, *> {
    constructor(props) {
        super();

        this.state = {
            value: Value.fromJSON(props.value)
        };
    }

    render() {
        return (
            <Editor
                readOnly={true}
                autoCorrect={false}
                spellCheck={false}
                plugins={this.props.plugins}
                value={this.state.value}
                theme={this.props.cms.theme}
            />
        );
    }
}

export default compose(
    withCms(),
    withPlugins({ type: "cms-render-slate-editor", format: plugins => plugins.map(pl => pl.slate) })
)(SlateEditor);
