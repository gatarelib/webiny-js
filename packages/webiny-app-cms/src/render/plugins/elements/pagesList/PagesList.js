// @flow
import * as React from "react";
import warning from "warning";
import { pure } from "recompose";
import { Query } from "react-apollo";
import { loadPages } from "./graphql";
import { withPlugins } from "webiny-app/components";

const PagesList = pure((props: Object = {}) => {
    const { data = {}, theme, plugins } = props;
    const { component, ...vars } = data;

    const pageList = plugins.find(cmp => cmp.name === component);
    if (!pageList) {
        warning(false, `Pages list component "${component}" is missing!`);
        return null;
    }

    const { component: ListComponent } = pageList;

    if (!ListComponent) {
        warning(false, `React component is not defined for "${component}"!`);
        return null;
    }

    let sort = null;
    if (vars.sortBy) {
        // $FlowFixMe
        sort = { [vars.sortBy]: vars.sortDirection || -1 };
    }

    const variables = {
        category: vars.category,
        sort,
        tags: vars.tags,
        tagsRule: vars.tagsRule,
        perPage: parseInt(vars.resultsPerPage),
        pagesLimit: parseInt(vars.pagesLimit),
        page: 1
    };

    return (
        <Query query={loadPages} variables={variables}>
            {({ data, loading, refetch }) => {
                if (loading) {
                    return null;
                }

                const pages = data.cms.listPublishedPages;

                if (!pages || !pages.data.length) {
                    return null;
                }

                let prevPage = null;
                if (pages.meta.previousPage !== null) {
                    prevPage = () => refetch({ ...variables, page: pages.meta.previousPage });
                }

                let nextPage = null;
                if (pages.meta.nextPage !== null) {
                    if (!variables.pagesLimit || variables.pagesLimit >= pages.meta.nextPage) {
                        nextPage = () => refetch({ ...variables, page: pages.meta.nextPage });
                    }
                }

                return (
                    <ListComponent
                        {...pages}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        theme={theme}
                    />
                );
            }}
        </Query>
    );
});

export default withPlugins({ type: "cms-element-pages-list-component" })(PagesList);
