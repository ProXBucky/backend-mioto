import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SECRET } from '../config';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
// import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './roles.guard';

@Module({
    imports: [
        JwtModule.register({
            secret: SECRET,
            signOptions: { expiresIn: '1h' },
        }),
        UserModule, AdminModule
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
