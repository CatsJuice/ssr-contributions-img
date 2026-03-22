import { Request } from 'express';
import { GithubUser } from './contribution.interface';
import { GithubContributionsMeta } from '../services/github-contributions.service';

export interface ExtendedRequest extends Request {
  raw?: ExtendedRequest;
  user?: GithubUser;
  contributionMeta?: GithubContributionsMeta;
}
