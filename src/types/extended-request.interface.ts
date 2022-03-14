import { Request } from 'express';
import { GithubUser } from './contribution.interface';

export interface ExtendedRequest extends Request {
  raw?: ExtendedRequest;
  user?: GithubUser;
}
