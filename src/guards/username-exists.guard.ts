import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ExtendedRequest } from 'src/types/extended-request.interface';

@Injectable()
export class UsernameExistsGuard implements CanActivate {
  constructor(
    private readonly _httpSrv: HttpService,
    private readonly _cfgSrv: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: ExtendedRequest = context.switchToHttp().getRequest();
    const username = req.params?.username || req.raw?.params?.username;
    if (!username) throw new NotFoundException('Username must not be empty');
    const res = await this._httpSrv.axiosRef({
      method: 'POST',
      baseURL: 'https://api.github.com/graphql',
      headers: {
        Authorization: `Bearer ${this._cfgSrv.get('github.pat')}`,
      },
      data: {
        query: `query {
            user(login: "${username}") {
                contributionsCollection {
                    contributionCalendar {
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                            }
                            firstDay
                        }
                    }
                }
            }
          }`,
      },
    });
    const user = res.data?.data?.user;
    if (!user) throw new NotFoundException(`User ${username} not found`);
    req.user = user;
    return true;
  }
}
