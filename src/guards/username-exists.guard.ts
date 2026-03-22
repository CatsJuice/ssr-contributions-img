import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { ExtendedRequest } from '../types/extended-request.interface';
import { GithubContributionsService } from '../services/github-contributions.service';

@Injectable()
export class UsernameExistsGuard implements CanActivate {
  constructor(
    private readonly githubContributionsService: GithubContributionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: ExtendedRequest = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const username = req.params?.username || req.raw?.params?.username;
    if (!username) throw new NotFoundException('Username must not be empty');
    const result = await this.githubContributionsService.getUserContributions(
      username,
    );

    res.setHeader('X-GitHub-Contributions-Source', result.meta.source);
    res.setHeader(
      'X-GitHub-Private-Contributions',
      result.meta.privateContributionsMode,
    );
    res.setHeader(
      'X-GitHub-Private-Contributions-Reason',
      result.meta.privateContributionsReason,
    );
    req.user = result.user;
    req.contributionMeta = result.meta;
    return true;
  }
}
