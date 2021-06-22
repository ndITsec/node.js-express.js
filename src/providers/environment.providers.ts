import { Provider } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ENVIROMENT_TOKEN } from '../constants';
import { IEnvironment } from '../interfaces/environment';

export const environmentProviders: Provider[] = [
  {
    provide: ENVIROMENT_TOKEN,
    useFactory: () => {
      const secret: string =
        process.env.SECRET || randomBytes(16).toString('hex');

      const environment: IEnvironment = {
        secret,
      };

      return environment;
    },
  },
];
