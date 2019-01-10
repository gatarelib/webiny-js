// @flow
import type { WithFileUploadPlugin } from "webiny-app/types";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { createOmitTypenameLink } from "webiny-app/graphql";
import gql from "graphql-tag";
import { InMemoryCache } from "apollo-cache-inmemory";

let client = null;
const fileUploadPlugin: WithFileUploadPlugin = {
    type: "with-file-upload",
    name: "webiny-cloud-files",
    upload: async (file: Object, config: { uri: string }) => {
        console.log(config)
        if (!client) {
            client = new ApolloClient({
                link: ApolloLink.from([
                    createOmitTypenameLink(),
                    new BatchHttpLink({ uri: config.uri || "https://cloud.webiny.com/files" })
                ]),
                cache: new InMemoryCache({
                    addTypename: true,
                    dataIdFromObject: obj => obj.id || null
                }),
                defaultOptions: {
                    watchQuery: {
                        fetchPolicy: "network-only",
                        errorPolicy: "all"
                    },
                    query: {
                        fetchPolicy: "network-only",
                        errorPolicy: "all"
                    }
                }
            });
        }

        console.log("idemooo");
        const results = await client.query({
            query: gql`
                query getFileUploadToken($name: String, $type: String, $size: String) {
                    files {
                        getFileUploadToken(name: "asd", type: "asd", size: 123)
                    }
                }
            `
        });

        console.log("results", results);
    }
};

export default fileUploadPlugin;
