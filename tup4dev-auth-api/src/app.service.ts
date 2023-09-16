import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserSingIn } from './app.interfaces';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AppService {
  private users: User[] = [
    {
      id: 1,
      email: 'admin@email.com',
      name: 'admin',
      username: 'admin',
      password: 'admin',
      scopes: ['ADMIN'],
    },
    {
      id: 2,
      email: 'john@email.com',
      name: 'John Doe',
      username: 'john',
      password: 'foo',
      scopes: ['READ'],
    },
    {
      id: 2,
      email: 'jane@email.com',
      name: 'Jane Doe',
      username: 'jane',
      password: 'bar',
      scopes: ['CREATE', 'UPDATE', 'READ', 'DELETE'],
    },
  ];

  async getUser(data: UserSingIn) {
    const userExists = this.users.find(
      (user) =>
        data.username === user.username && data.password === user.password,
    );
    if (!userExists)
      throw new UnauthorizedException(
        'Please check your username and password.',
      );

    const expiresIn = 300;
    const access_token = sign(
      {
        id: userExists.id,
        email: userExists.email,
        name: userExists.name,
        username: userExists.username,
        scopes: userExists.scopes,
        expiresIn,
      },
      process.env.JWT_SECRET,
      {
        expiresIn,
      },
    );

    return {
      access_token,
      expiresIn,
      scopes: userExists.scopes,
    };
  }
}
