import "reflect-metadata";
import { createConnection, Connection, Table } from "typeorm";
import * as restify from "restify";
import * as corsMiddleware from "restify-cors-middleware";

import { keys } from "./keys";

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
server.listen(serverPort),
    async () => {
        try {
            if (database) {
                await createConnection({
                    type: "postgres",
                    host: host || "localhost",
                    port: parseInt(port, 10) || 5432,
                    username: username || "postgres",
                    password: password || "postgres_password",
                    database: database,
                    synchronize: true,
                    entities: ["./entity/**/*.ts"]
                });
            } else {
                console.error(
                    `api : Env variables error \n ${JSON.stringify({
                        database
                    })}`
                );
            }
        } catch (err) {
            console.error(`api: Database connection failed ${err}`);
        }
    };
