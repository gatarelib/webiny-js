// @flow
import * as React from "react";
import invariant from "invariant";
import type { PluginType } from "webiny-plugins/types";
import { get } from "lodash";
import { Plugin } from "webiny-app/components/Plugins";

type ImageProps = Object & {
    src: string,
    preset?: string,
    transform?: Object,

    // "auto" is a special keyword - if present, plugins insert their own srcSet.
    srcSet?: Object | "auto"
};

/**
 * "buildSrc" has to be defined as a separate property, so its functionality can be reused outside of
 * the Image component. This is ideal in cases where manual creation of image src is needed.
 */
export type ImageComponentPluginType = PluginType & {
    type: string,
    render: ImageProps => React.Node,
    getImageSrc: (props: ?Object) => string
};

export const Image = (props: ImageProps) => {
    let { preset: presetName, ...rest } = props;

    return (
        <Plugin name={"image-component"}>
            {({ plugin: instance }) => {
                if (!instance) {
                    throw new Error(`Image component plugin (type "image-component") not defined.`);
                }

                const plugin = { instance, props: { ...rest } };

                if (presetName) {
                    const preset = get(plugin.instance, `presets.${presetName}`);
                    invariant(preset, `Transform preset "${presetName}" not found.`);
                    plugin.props.transform = preset;
                }

                if (plugin.props.transform) {
                    plugin.props.src = plugin.instance.getImageSrc(plugin.props);
                }

                return plugin.instance.render(plugin.props);
            }}
        </Plugin>
    );
};