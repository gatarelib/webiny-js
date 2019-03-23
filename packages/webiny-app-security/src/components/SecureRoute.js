// @flow
import * as React from "react";
import { hasScopes, hasRoles } from "webiny-app-security";
import { Plugin } from "webiny-app/components/plugins";

export default ({ children, scopes, roles }: Object): React.Node => {
    const checks = {
        scopes: scopes ? hasScopes(scopes, { forceBoolean: true }) : true,
        roles: roles ? hasRoles(roles, { forceBoolean: true }) : true
    };

    if (checks.scopes && checks.roles) {
        return children;
    }

    return (
        <Plugin name={"secure-route-error"}>
            {({ plugin }) => {
                if (!plugin) {
                    return <span>You are not authorized to view this route.</span>;
                }
                return plugin.render();
            }}
        </Plugin>
    );
};
