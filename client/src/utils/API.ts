import { HTTP } from "./HTTP";

export class API extends HTTP {
    constructor(public prefix: string) {
        super();
    }

    public getIndexes = async () => {
        return await this.get("/indexes");
    };

    public getValues = async () => {
        return await this.get("/values");
    };

    public setValues = async (index: string) => {
        return await this.post("/values", { index });
    };
}
