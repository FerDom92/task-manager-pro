import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, FilterTasksDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TaskPermissionGuard, RequireTaskPermission } from '../common/guards/task-permission.guard';
import { TaskAction, PermissionsService } from '../common/permissions/permissions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard, TaskPermissionGuard)
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private permissionsService: PermissionsService,
  ) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser('id') userId: string) {
    return this.tasksService.create(dto, userId);
  }

  @Get()
  findAll(@Query() filters: FilterTasksDto, @CurrentUser('id') userId: string) {
    return this.tasksService.findAll(filters, userId);
  }

  @Get('stats')
  getStats(@CurrentUser('id') userId: string) {
    return this.tasksService.getStats(userId);
  }

  @Get(':id')
  @RequireTaskPermission(TaskAction.VIEW)
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Get(':id/permissions')
  async getPermissions(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.permissionsService.getTaskPermissions(userId, id);
  }

  @Patch(':id')
  @RequireTaskPermission(TaskAction.UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.tasksService.update(id, dto, userId);
  }

  @Delete(':id')
  @RequireTaskPermission(TaskAction.DELETE)
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.tasksService.delete(id, userId);
  }
}
