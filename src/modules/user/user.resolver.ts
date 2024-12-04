import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserInfo } from './user.repository';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Query(() => [User])
  async users(): Promise<UserInfo[]> {
    return this.userService.getAllUsers();
  }
}
