import { Server } from "restify";
import { Index } from "../entity/Index";

export const indexes = (server: Server) => {
    server.get("/api/indexes/all", async (_req, res, next) => {
        const indexes = await Index.find();

        console.log(indexes);

        res.send(200, "hello");
        next();
    });
};
