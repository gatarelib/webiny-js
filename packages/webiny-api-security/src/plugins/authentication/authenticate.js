// @flow
import { JwtToken } from "./jwtToken";

export default async ({ config, event }: Object) => {
    let token = (event.headers.Authorization || "").replace("Bearer ", "");
    let user = null;
    if (token !== "" && event.httpMethod === "POST") {
        const jwt = new JwtToken({ secret: config.security.token.secret });
        user = (await jwt.decode(token)).data;

        return user;
    }
};
