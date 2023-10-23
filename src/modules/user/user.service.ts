import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    async create(data: UserDTO) {
        const userExists = await this.prisma.user.findFirst({
            where: {
                email: data.email,
            },
        });

        if (userExists) {
            throw new Error('Já existe um usuário cadastrado com esse email');
        }

        const created = await this.prisma.user.create({
            data: data,
        });

        return created;
    }

    findAll() {
        return `This action returns all user`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    // update(id: number, updateUserDto: UpdateUserDto) {
    //     return `This action updates a #${id} user`;
    // }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
