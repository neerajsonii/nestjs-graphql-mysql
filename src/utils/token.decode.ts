
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { UserData } from '../shared/interfaces/auth.interface';

export const decodeToken = (token: string): UserData => {
    return jwt.verify(token, config().jwtSecret);
}