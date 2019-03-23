// @flow
import * as React from "react";
import { Image } from "./Image";
import { SingleImageUpload as UiImageUpload } from "webiny-ui/ImageUpload";

type Props = Object;

export const SingleImageUpload = ({ imagePreviewProps, ...singleImageUploadProps }: Props) => {
    return (
        <UiImageUpload
            renderImagePreview={(renderImageProps: Object) => (
                <Image {...renderImageProps} {...imagePreviewProps} />
            )}
            {...singleImageUploadProps}
        />
    );
};
