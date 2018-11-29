// @flow
import gql from "graphql-tag";

const fields = /* GraphQL */ `
    {
        palette {
            popup
            button
        }
    }
`;

const graphql = {
    query: gql`
            query getSettings {
                settings {
                    cookiePolicy ${fields}
                }
            }
        `,
    mutation: gql`
            mutation updateSettings($data: CookiePolicySettingsInput) {
                settings {
                    cookiePolicy(data: $data) ${fields}
                }
            }
        `
};

export default graphql;