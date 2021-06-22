import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { readFile } from 'fs';
import { join } from 'path';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  private readonly USERS_CACHE_KEY: string = 'USERS_CACHE_KEY';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getUsers(req: Request): Promise<number[] | Error> {
    this.ensureProperAcceptHeader(req);

    const usersData: unknown = await this.tryToRetrieveCachedUsersData();

    return Object.keys(usersData).map(Number);
  }

  async getUser(req: Request, id: string): Promise<User | Error> {
    this.ensureProperAcceptHeader(req);

    const usersData: unknown = await this.tryToRetrieveCachedUsersData();
    const user: User = usersData[id];

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  private ensureProperAcceptHeader(req: Request): void {
    const acceptHeader: string = req.header('Accept');

    if (acceptHeader !== 'application/json') {
      throw new NotAcceptableException();
    }
  }

  private async tryToRetrieveCachedUsersData(): Promise<unknown> {
    let usersData: unknown;
    let usersCache: unknown = await this.cacheManager.get(this.USERS_CACHE_KEY);

    if (usersCache) {
      usersData = usersCache;
    } else {
      usersData = await new Promise(function (resolve, reject) {
        readFile(
          join(process.cwd(), 'assets/users.json'),
          'utf-8',
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.parse(data));
            }
          },
        );
      });

      await this.cacheManager.set(this.USERS_CACHE_KEY, usersData, {
        ttl: null,
      });
    }

    return usersData;
  }
}
