import { Server } from "restify";
import { RedisClient } from "redis";
import { Connection } from "typeorm";

export const values = (
    server: Server,
    connection: Connection,
    redisClient: RedisClient
) => {
    const publisher = redisClient.duplicate();

    server.get("/values", (_req, res, next) => {
        redisClient.hgetall("values", (err, reply) => {
            if (err) {
                console.error(`api: Unable to get values from redis \n${err}`);
            }
            res.send(reply);
        });
        next();
    });

    server.post("/values", async (req, res, next) => {
        const { index } = req.body;
        if (!index) {
            res.send(400, "index not provided!");
            next();
        } else {
            try {
                publisher.publish("insert", index);
                await connection.query(
                    "INSERT INTO indexes(number) VALUES($1)",
                    [index]
                );
                res.send(200);
                next();
            } catch (err) {
                console.error(`api: Unable to set values to redis \n${err}`);
                res.send(500, "oops");
                next();
            }
        }
    });
};
