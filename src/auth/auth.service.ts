import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && bcrypt.compareSync(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        if (!user.username || !user.password) {
            return { error: 'Username and password are required' };
        }
        const validatedUser = await this.validateUser(user.username, user.password);
        if (validatedUser) {
            const payload = { username: validatedUser.username, sub: validatedUser.id };
            return {
                access_token: this.jwtService.sign(payload),
            };
        } else {
            return { error: 'Invalid username or password' };
        }
    }

    async register(user: any) {
        user.password = bcrypt.hashSync(user.password, 8);
        return this.usersService.create(user);
    }
}
