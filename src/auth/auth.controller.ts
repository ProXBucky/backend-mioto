import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/LoginUserDTO.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    async login(@Body() credentials: LoginUserDTO) {
        const user = await this.authService.validateUser(credentials.username, credentials.password);
        if (!user) {
            // Trả về lỗi nếu thông tin đăng nhập không hợp lệ
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        // Xác thực thông tin đăng nhập và tạo token JWT
        const token = await this.authService.createToken({ userId: user.userId, username: user.username });
        return {
            token,
            fullname: user.fullname,
            userId: user.userId,
            avatarImage: user.avatarImage
        };
    }

    @Post('/logout')
    async logout(@Body() token: { token: string }) {
        await this.authService.invalidateToken(token.token);
        return { message: 'Logged out successfully' };
    }

    @Post('/login-admin')
    async loginAdmin(@Body() credentials: LoginUserDTO) {
        const admin = await this.authService.validateAdmin(credentials.username, credentials.password);
        if (!admin) {
            throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        }
        const token = await this.authService.createToken({ userId: admin.adminId, username: admin.username, role: admin.role });
        return {
            token,
            adminId: admin.adminId,
            fullname: admin.fullname,
            role: admin.role,
            avatar: admin.avatarImage
        };
    }

    @Post('/logout-admin')
    async logoutAdmin(@Body() token: { token: string }) {
        await this.authService.invalidateToken(token.token);
        return { message: 'Logged out successfully' };
    }

    @Post('/reset-password')
    async resetPassword(@Body() email: { email: string }) {
        await this.authService.resetPassword(email.email);
        return { message: 'New password sent to your email' };
    }

    @Post('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookLoginCallback(@Req() req) {
        const user = await this.authService.findOrCreateUserFromFacebook(req.user);
        const token = await this.authService.createToken(user);
        return { token, user };
    }

    @Post('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req) {
        console.log(req)
        const user = await this.authService.findOrCreateUserFromGoogle(req.user);
        const token = await this.authService.createToken(user);
        return { token, user };
    }
}
