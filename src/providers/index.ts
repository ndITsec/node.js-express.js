import { Provider } from '@nestjs/common';
import { environmentProviders } from './environment.providers';

export const providers: Provider[] = [...environmentProviders];
