// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { Injectable } from '@nestjs/common';
// import { AuthService } from './auth.service';
// // import { BACKEND_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../src/config';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//     constructor(private readonly authService: AuthService) {
//         super({
//             clientID: GOOGLE_CLIENT_ID,
//             clientSecret: GOOGLE_CLIENT_SECRET,
//             callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
//             scope: ['email', 'profile'],
//         });
//     }

//     async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
//         console.log("profile", profile)
//         const { name, emails, photos } = profile;
//         const userProfile = {
//             id: profile.id,
//             email: emails[0].value,
//             firstName: name.givenName,
//             lastName: name.familyName,
//             picture: photos[0].value,
//             accessToken,
//         };
//         const user = await this.authService.findOrCreateUserFromGoogle(userProfile);
//         done(null, user);
//     }
// }
