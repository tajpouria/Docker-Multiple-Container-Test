import { Server } from "restify";
import { Connection } from "typeorm";

export const indexes = (server: Server, connection: Connection) => {
    server.get("/indexes", async (_req, res, next) => {
        const indexes = await connection.query("SELECT * FROM indexes");
        res.send(indexes);
        next();
    });
};
