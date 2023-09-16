import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/database/prisma.service';
import { User } from 'src/user/user.interface';
import { ClientProxy } from '@nestjs/microservices';
import { Log } from './log.interface';

@Injectable()
export class TodoService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('LOG_SERVICE') private client: ClientProxy,
  ) {}

  async sendLog(log: Log) {
    console.log(`Sending log ${JSON.stringify(log)}`);
    return this.client.emit('log', log);
  }

  async create(createTodoDto: CreateTodoDto, user: User) {
    const createdTodo = await this.prismaService.todo.create({
      data: {
        userId: user.id,
        content: createTodoDto.content,
      },
    });
    await this.sendLog({
      action: 'CREATE',
      userId: user.id,
      content: createdTodo,
    });
    return createdTodo;
  }

  async findAll(user: User) {
    const todos = await this.prismaService.todo.findMany({
      where: { userId: user.id },
    });
    await this.sendLog({
      action: 'READ',
      userId: user.id,
      content: todos,
    });
    return todos;
  }

  async findOne(id: number, user: User) {
    const todo = await this.prismaService.todo.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!todo) throw new NotFoundException('Todo not found!');
    await this.sendLog({
      action: 'READ',
      userId: user.id,
      content: todo,
    });
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, user: User) {
    const todo = await this.prismaService.todo.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!todo) throw new NotFoundException('Todo not found!');

    const todoUpdated = await this.prismaService.todo.update({
      data: {
        content: updateTodoDto.content,
      },
      where: {
        id,
      },
    });
    await this.sendLog({
      action: 'UPDATE',
      userId: user.id,
      content: todoUpdated,
    });
    return todoUpdated;
  }

  async remove(id: number, user: User) {
    const todo = await this.prismaService.todo.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!todo) throw new NotFoundException('Todo not found!');
    await this.prismaService.todo.delete({
      where: {
        id,
      },
    });
    await this.sendLog({
      action: 'DELETE',
      userId: user.id,
      content: todo,
    });
    return;
  }
}
