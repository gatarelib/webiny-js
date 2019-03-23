// @flow
import * as React from "react";
import { withImageUpload } from "webiny-app/components";
import { SingleImageUpload } from "webiny-app/components/imageUpload";

const Image = props => {
    return <SingleImageUpload {...props} />;
};

export default withImageUpload()(Image);
