import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)

/** const redis = new Redis({
    host: "redis",
    port: 6379,
    retryStrategy: (times) => {
        return 1000;
    },
    //maxRetriesPerRequest: 10,
    enableReadyCheck: true,
}); **/


export default redis;
