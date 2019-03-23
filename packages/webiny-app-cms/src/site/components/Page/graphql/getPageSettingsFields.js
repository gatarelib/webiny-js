// @flow
import { getPluginsSync } from "webiny-plugins";
import type { CmsPageSettingsFieldsPluginType } from "webiny-app-cms/types";

export default () => {
    return getPluginsSync("cms-page-settings-fields")
        .map((pl: CmsPageSettingsFieldsPluginType) => pl.fields)
        .join("\n");
};
