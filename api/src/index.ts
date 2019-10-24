import "reflect-metadata";
import { createConnection } from "typeorm";
import * as restify from "restify";
import * as corsMiddleware from "restify-cors-middleware";

import { keys } from "./keys";
import { Index } from "./entity/Index";
import { indexes } from "./routes/indexes";

const server = restify.createServer();

const cors = corsMiddleware({
    origins: ["*"],
    allowHeaders: ["*"],
    exposeHeaders: ["*"]
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

const { serverPort, host, database, port, username, password } = keys;
server.listen(serverPort, async () => {
    try {
        if (database) {
            const connection = await createConnection({
                synchronize: true,
                type: "postgres",
                host: host || "localhost",
                port: parseInt(port, 10) || 5432,
                username: username || "postgres",
                password: password || "postgres_password",
                database: database,
                entities: [Index]
            });
            // routes
            if (connection && connection.isConnected) {
                indexes(server);
            }
        } else {
            console.error(
                `api: Env variables error \n ${JSON.stringify({
                    database
                })}`
            );
        }
    } catch (err) {
        console.error(`api: Database connection failed \n${err}`);
    } finally {
        console.info(`API is up on port ${serverPort}...`);
    }
});
