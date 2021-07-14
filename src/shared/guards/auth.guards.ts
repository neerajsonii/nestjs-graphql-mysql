import { ExecutionContext, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { decodeToken } from "../../utils/token.decode";
import { UserData } from "../interfaces/auth.interface";

const authError = {
    error: 'Unauthorized. Error while authorization verifying token',
    message: '',
    statusCode: HttpStatus.UNAUTHORIZED
}

export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context).getContext();
        const roles = this.reflector.get<string[]>('roles', context.getHandler())
        if (!ctx.headers.authorization) {
            return false
        }

        ctx.user = this.validateToken(ctx.headers.authorization);
        if (roles && roles.length) {
            this.validateUserRole(ctx.user.role, roles);
        }
        return true;
    }

    private validateUserRole(userRole: string, requiredRoles: string[]): void {
        if (!requiredRoles.includes(userRole)) {
            authError.message = 'Forbidden resource for the current user. Please check the permissions associated with this user.'
            throw new UnauthorizedException(authError);
        }
     }

    private validateToken(authToken: string): UserData {
        const [prefix, token] = authToken.split('');
        if (prefix !== 'Bearer' || !token || token === '') {
            authError.message = 'Invalid token format';
            throw new UnauthorizedException(authError);
        }
        try {
            const decodedTokenData = decodeToken(token);
            return decodedTokenData;
        } catch (error) {
            authError.message = 'Invalid token';
            throw new UnauthorizedException(authError);
        }
    }
}