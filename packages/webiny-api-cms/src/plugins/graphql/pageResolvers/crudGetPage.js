// @flow
import shortid from "shortid";
import cloneDeep from "lodash/cloneDeep";
import isPlainObject from "lodash/isPlainObject";
import type { IPage } from "webiny-api-cms/entities";
import { ErrorResponse, Response } from "webiny-api/graphql/responses";

function updateChildPaths(element: Object) {
    if (!element.id) {
        element.id = shortid.generate();
    }

    if (!element.path) {
        element.path = "0";
    }

    if (Array.isArray(element.elements)) {
        // Process children only if "elements" is an array of objects.
        // We may get an array of strings when working with shallow element copies.
        if (isPlainObject(element.elements[0])) {
            element.elements.forEach((el, index) => {
                if (!el.id) {
                    el.id = shortid.generate();
                }

                el.path = element.path + "." + index;
                if (el.elements.length) {
                    updateChildPaths(el);
                }
            });
        }
    }
}

async function injectGlobalElement(el: Object, context: Object) {
    if (el.global && el.source) {
        const { Element } = context.cms.entities;
        const source = await Element.findById(el.source);

        el = {
            ...el,
            data: source.content.data,
            elements: cloneDeep(source.content.elements)
        };
    }

    if (Array.isArray(el.elements) && el.elements.length) {
        const children = [];
        for (let i = 0; i < el.elements.length; i++) {
            children[i] = await injectGlobalElement(el.elements[i], context);
        }
        el.elements = children;
    }

    return el;
}

type EntityFetcher = (context: Object) => Class<IPage>;

const notFound = (id?: string) =>
    new ErrorResponse({
        code: "NOT_FOUND",
        message: id ? `Record "${id}" not found!` : "Record not found!"
    });

export default (entityFetcher: EntityFetcher) => async (
    root: any,
    args: Object,
    context: Object
) => {
    const Page = entityFetcher(context);

    if (args.id) {
        // $FlowFixMe
        const page = await Page.findById(args.id);
        if (!page) {
            return notFound(args.id);
        }

        // Inject global elements
        const content = await injectGlobalElement(cloneDeep(page.content), context);
        updateChildPaths(content);
        page.content = content;
        return new Response(page);
    }

    // $FlowFixMe
    const page = await Page.findOne({ query: args.where, sort: args.sort });

    if (!page) {
        return notFound();
    }

    // Inject global elements
    const content = page.content;

    for (let i = 0; i < content.elements.length; i++) {
        await injectGlobalElement(content.elements[i], context);
    }

    page.content = content;

    return new Response(page);
};
