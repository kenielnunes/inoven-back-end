import { Request } from 'express';
import { UserDTO } from 'src/modules/user/dto/user.dto';

export class UserRequestDTO extends Request {
    user: UserDTO;
}
