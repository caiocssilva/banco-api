import { Controller, Get, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './account.entity';

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Post()
    create(@Body() account: Account): Promise<Account> {
        return this.accountService.create(account);
    }

    @Get()
    findAll(): Promise<Account[]> {
        return this.accountService.findAll();
    }
}
