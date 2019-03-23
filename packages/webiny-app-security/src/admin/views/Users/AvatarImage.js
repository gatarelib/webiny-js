// @flow
import * as React from "react";
import { withImageUpload } from "webiny-app/components";
import { SingleImageUpload } from "webiny-app/components/imageUpload";

const AvatarImage = props => {
    return (
        <SingleImageUpload
            {...props}
            imagePreviewProps={{ transform: { width: 300 } }}
        />
    );
};

export default withImageUpload()(AvatarImage);
