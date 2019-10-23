import { Server } from "restify";
import { Index } from "../entity/Index";

export const indexes = (server: Server) => {
    server.get("/indexes/all", async (_req, res, next) => {
        const indexes = await Index.find();
        res.json(indexes);
        next();
    });
};
