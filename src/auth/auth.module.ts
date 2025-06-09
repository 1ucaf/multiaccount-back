import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TenantContextService } from 'src/auth/tenancy/tenant-context.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRE
        }
      })
    }),
    UsersModule,
    AccountsModule,
  ],
  providers: [AuthService, JwtStrategy, TenantContextService],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, TenantContextService]
})
export class AuthModule {}
