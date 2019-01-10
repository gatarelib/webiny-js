// @flow
import { authenticated } from "webiny-api-security";
import { dummyResolver } from "webiny-api/graphql";
import type { PluginType } from "webiny-plugins/types";
import cryptoJs from "crypto-js";

export type WebinyCloudFilesPluginsType = ({ encryptionKey: string }) => Array<PluginType>;

const registerPlugins: WebinyCloudFilesPluginsType = ({ encryptionKey }) => [
    {
        name: "graphql-schema-webiny-files",
        type: "graphql",
        typeDefs: /* GraphQL */ `
            type WebinyFiles {
                getFileUploadToken(name: String!, size: Int!, type: String!): String
            }

            type Query {
                files: WebinyFiles
            }
        `,
        resolvers: () => ({
            Query: {
                files: dummyResolver
            },
            WebinyFiles: {
                getFileUploadToken: (_, { name, size, type }) => {
                    // Encrypt
                    return cryptoJs.AES.encrypt(
                        JSON.stringify({ name, size, type }),
                        encryptionKey
                    ).toString();
                }
            }
        }),
        security: {
            shield: {
                WebinyFiles: {
                    getFileUploadToken: authenticated()
                }
            }
        }
    }
];

export default registerPlugins;
