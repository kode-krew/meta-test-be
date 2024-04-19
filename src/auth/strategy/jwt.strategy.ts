// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../modules/user/user.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (!token) {
          throw new UnauthorizedException('No token');
        }
        return token;
      },
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (Date.now() >= payload.exp * 1000) {
      throw new UnauthorizedException('Token expired');
    }

    const id = payload.id;
    if (!id) {
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
