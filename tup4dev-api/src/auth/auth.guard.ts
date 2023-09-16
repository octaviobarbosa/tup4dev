import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;

      if (!authorization) {
        throw new UnauthorizedException('Missing authorization headers');
      }

      const [bearer, token] = authorization.split(' ');

      if (!token || bearer.toLowerCase() !== 'bearer') {
        throw new UnauthorizedException('bearer token is invalid or missing');
      }
      const decoded: any = verify(token, '@TUP4DEV');

      const permissions = this.reflector.get<string[]>(
        'permissions',
        context.getHandler(),
      );
      const { scopes } = decoded;

      const userHasPermission = scopes.filter((s) => permissions.includes(s));

      if (userHasPermission.length <= 0) {
        throw new HttpException('forbidden resource', HttpStatus.FORBIDDEN);
      }

      const user: User = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        username: decoded.username,
      };

      request['user'] = user;

      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new UnauthorizedException('bearer token is invalid or missing');
      throw error;
    }
  }
}
