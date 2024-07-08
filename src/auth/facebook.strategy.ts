// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-facebook';
// import { Injectable } from '@nestjs/common';
// import { AuthService } from './auth.service';
// // import { BACKEND_URL, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from '../../src/config';

// @Injectable()
// export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
//     constructor(private readonly authService: AuthService) {
//         super({
//             // clientID: FACEBOOK_APP_ID,
//             // clientSecret: FACEBOOK_APP_SECRET,
//             // callbackURL: `${BACKEND_URL}/api/auth/facebook/callback`,
//             profileFields: ['id', 'name', 'emails', 'photos'],
//         });
//     }

//     async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
//         const { name, emails, photos } = profile;
//         const userProfile = {
//             id: profile.id,
//             email: emails[0].value,
//             firstName: name.givenName,
//             lastName: name.familyName,
//             picture: photos[0].value,
//             accessToken,
//         };
//         const user = await this.authService.findOrCreateUserFromFacebook(userProfile);
//         done(null, user);
//     }
// }

