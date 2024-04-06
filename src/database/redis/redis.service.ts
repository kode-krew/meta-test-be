// import { Inject, Injectable } from '@nestjs/common';
// import { Cluster } from 'ioredis';

// @Injectable()
// export class RedisService {
//   constructor(@Inject('REDIS_CLIENT') private redis: Cluster) {}

//   async getKeys() {
//     const keys = await this.redis.keys('*');
//     return keys;
//   }

//   async getOne(key: string) {
//     return await this.redis.get(key);
//   }

//   async setOne(data: { key: string; value: string }) {
//     return await this.redis.set(data.key, data.value);
//   }
// }
