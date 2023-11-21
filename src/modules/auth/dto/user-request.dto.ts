import { Request } from 'express';
import { UserPayload } from './user-payload';

export class UserRequestDTO extends Request {
    user: UserPayload;
}
