// @flow
import * as React from "react";
import { Image } from "./Image";
import { MultiImageUpload as UiImageUpload } from "webiny-ui/ImageUpload";

type Props = Object;

export const MultiImageUpload = ({ imagePreviewProps, ...multiImageUploadProps }: Props) => {
    return (
        <UiImageUpload
            renderImagePreview={(renderImageProps: Object) => {
                return (
                    <Image
                        transform={{ width: 300 }}
                        {...imagePreviewProps}
                        {...renderImageProps}
                    />
                );
            }}
            {...multiImageUploadProps}
        />
    );
};
