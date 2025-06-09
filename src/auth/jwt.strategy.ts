import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AccountsService } from "src/accounts/accounts.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate(payload) {
    const { id } = payload;
    const user = await this.usersService.getById(id)
    if(!user) {
      throw new UnauthorizedException('Login first to access this endpoint.')
    }
    user.account = await this.accountsService.getById(user.account_id)
    return user
  }
}