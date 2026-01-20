import Redis from "ioredis";
import {setInterval} from "node:timers";

type RedisClient = Redis;


const redis: RedisClient = new Redis({
    host: "localhost",
    port: 6379,
});

setInterval(async () => {
    redis.ping((_, result) => {
        console.log(result);
    });
}, 60000 * 10)

export default redis;

