// import { Module, Global } from '@nestjs/common';
// import Redis from 'ioredis';
// import { RedisService } from './redis.service';

// @Global()
// @Module({
//   providers: [
//     {
//       provide: 'REDIS_CLIENT',
//       useFactory: () => {
//         return new Redis.Cluster(
//           [
//             {
//               host: 'dev-metacognition-test.ajgfyp.clustercfg.apn2.cache.amazonaws.com:6379',
//             },
//           ],
//           { enableReadyCheck: false, maxRedirections: null },
//         );
//       },
//     },
//     RedisService,
//   ],
//   exports: ['REDIS_CLIENT', RedisService],
// })
// export class RedisModule {}
