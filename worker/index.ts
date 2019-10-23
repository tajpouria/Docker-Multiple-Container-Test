import redis from "redis";
import { keys } from "./keys";

const { redisHost: host, redisPort } = keys;

if (host && redisPort) {
    const client = redis.createClient({ host, port: parseInt(redisPort, 10) });
    const sub = client.duplicate();

    const fib = (index: number, memo: number[] = []): number => {
        if (memo[index]) return memo[index];

        if (index <= 2) return 1;
        const res = fib(index - 1, memo) + fib(index - 2, memo);
        memo[index] = res;

        return res;
    };

    sub.on("message", (_channel, message) => {
        client.hset("values", message, fib(parseInt(message)).toString());
    });
    sub.subscribe("insert");
} else {
    console.error(
        `worker: Env variables error \n ${JSON.stringify({ host, redisPort })}`
    );
}
