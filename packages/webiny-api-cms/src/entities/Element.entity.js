// @flow
import { Entity } from "webiny-entity";
import FileModel from "./File.model";

type ElementType = "element" | "block";

export interface IElement extends Entity {
    name: string;
    content: Object;
    type: ElementType;
    category: ?string;
    preview: Object;
    global: boolean;
}

export function elementFactory(): Class<IElement> {
    return class Element extends Entity {
        static classId = "CmsElement";
        static storageClassId = "Cms_Elements";

        name: string;
        content: Object;
        type: ElementType;
        category: ?string;
        preview: Object;
        global: boolean;

        constructor() {
            super();

            this.attr("name")
                .char()
                .setValidators("required");

            this.attr("category").char();

            this.attr("content").object();

            this.attr("global")
                .boolean()
                .setDefaultValue(false);

            this.attr("type")
                .char()
                .setValidators("required,in:element:block");

            this.attr("preview").model(FileModel);
        }
    };
}
