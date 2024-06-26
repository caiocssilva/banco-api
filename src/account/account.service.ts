import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
    ) {}

    async findById(id: number): Promise<Account | undefined> {
        return this.accountRepository.findOneBy({ id });
    }

    async create(account: Account): Promise<Account> {
        return this.accountRepository.save(account);
    }

    async findAll(): Promise<Account[]> {
        return this.accountRepository.find();
    }

    async update(id: number, updatedAccount: Partial<Account>): Promise<Account | undefined> {
        const account = await this.accountRepository.findOneBy({ id });
        if (!account) {
            throw new Error('Conta não encontrada');
        }

        Object.assign(account, updatedAccount);

        return this.accountRepository.save(account);
    }
}