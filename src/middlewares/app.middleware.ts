import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { ENVIROMENT_TOKEN } from '../constants';
import { IEnvironment } from '../interfaces/environment';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(
    @Inject(ENVIROMENT_TOKEN) private readonly environment: IEnvironment,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const customAuthHeader: string = req.header('custom-auth');
    const formatRegex: RegExp = /^\d+?\:[0-9a-zA-Z]+?$/g;

    // if format is neglected
    if (!formatRegex.test(customAuthHeader)) {
      throw new UnauthorizedException();
    }

    const [headerTimestamp, headerHash] = customAuthHeader.split(':');
    const generatedHeaderHash: string = this.generateHash(headerTimestamp);

    // hashes differ
    if (headerHash !== generatedHeaderHash) {
      throw new UnauthorizedException();
    }

    const deltaSeconds: number = 5;
    const timestamp: number = new Date().getTime();

    // more than deltaSeconds have passed
    if (Number(headerTimestamp) > timestamp + deltaSeconds) {
      throw new UnauthorizedException();
    }

    next();
  }

  private generateHash(timestamp: string): string {
    return createHmac('sha256', this.environment.secret)
      .update(`${timestamp}${this.environment.secret}`)
      .digest('hex');
  }
}
