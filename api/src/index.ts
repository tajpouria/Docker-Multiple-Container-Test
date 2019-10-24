import "reflect-metadata";
import { createConnection } from "typeorm";
import * as restify from "restify";
import * as corsMiddleware from "restify-cors-middleware";
import * as redis from "redis";

import { keys } from "./keys";
import { indexes } from "./routes/indexes";
import { values } from "./routes/values";

const server = restify.createServer();

const cors = corsMiddleware({
    origins: ["*"],
    allowHeaders: ["*"],
    exposeHeaders: ["*"]
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

const {
    serverPort,
    host,
    database,
    port,
    username,
    password,
    redisHost,
    redisPort
} = keys;
server.listen(serverPort, async () => {
    try {
        if (database && redisHost && redisPort) {
            const connection = await createConnection({
                type: "postgres",
                host: host || "localhost",
                port: parseInt(port, 10) || 5432,
                username: username || "postgres",
                password: password || "postgres_password",
                database: database
            });

            await connection.query(
                "CREATE TABLE IF NOT EXISTS indexes (number INT)"
            );

            const redisCli = redis.createClient({
                host: redisHost,
                port: parseInt(redisPort, 10),
                retry_strategy: () => 1000
            });

            // routes
            if (connection && connection.isConnected) {
                indexes(server, connection);
                values(server, connection, redisCli);
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
