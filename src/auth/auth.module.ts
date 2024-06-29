import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SECRET } from '../config';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { FacebookStrategy } from './facebook.strategy';
import { UserService } from '../user/user.service';

@Module({
    imports: [
        JwtModule.register({
            secret: SECRET,
            signOptions: { expiresIn: '1h' },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        UserModule, AdminModule,
    ],
    providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
