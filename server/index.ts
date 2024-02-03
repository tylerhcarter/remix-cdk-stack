import {createRequestHandler} from "@remix-run/architect";
import {ServerBuild} from "@remix-run/node";

const build = require('../build') as ServerBuild;

exports.handler = createRequestHandler({
    build,
    getLoadContext(event: any) {
        return {};
    }
})
