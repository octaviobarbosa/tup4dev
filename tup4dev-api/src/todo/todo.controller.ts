import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/permission.decorator';
import { Permission } from 'src/auth/permission.enum';

@Controller('todo')
@UseGuards(AuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @Permissions(Permission.admin, Permission.create)
  create(@Body() createTodoDto: CreateTodoDto, @Req() request: Request) {
    return this.todoService.create(createTodoDto, request['user']);
  }

  @Get()
  @Permissions(Permission.admin, Permission.read)
  findAll(@Req() request: Request) {
    return this.todoService.findAll(request['user']);
  }

  @Get(':id')
  @Permissions(Permission.admin, Permission.read)
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.todoService.findOne(+id, request['user']);
  }

  @Patch(':id')
  @Permissions(Permission.admin, Permission.update)
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() request: Request,
  ) {
    return this.todoService.update(+id, updateTodoDto, request['user']);
  }

  @Delete(':id')
  @Permissions(Permission.admin, Permission.delete)
  @HttpCode(201)
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.todoService.remove(+id, request['user']);
  }
}
