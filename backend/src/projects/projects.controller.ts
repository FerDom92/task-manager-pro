import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddMemberDto,
  UpdateMemberRoleDto,
} from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProjectPermissionGuard, RequireProjectPermission } from '../common/guards/project-permission.guard';
import { ProjectAction, PermissionsService } from '../common/permissions/permissions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard, ProjectPermissionGuard)
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
    private permissionsService: PermissionsService,
  ) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @CurrentUser('id') userId: string) {
    return this.projectsService.create(dto, userId);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  @RequireProjectPermission(ProjectAction.VIEW)
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.findOne(id, userId);
  }

  @Get(':id/permissions')
  async getPermissions(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.permissionsService.getProjectPermissions(userId, id);
  }

  @Patch(':id')
  @RequireProjectPermission(ProjectAction.UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.update(id, dto, userId);
  }

  @Delete(':id')
  @RequireProjectPermission(ProjectAction.DELETE)
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.delete(id, userId);
  }

  @Post(':id/members')
  @RequireProjectPermission(ProjectAction.MANAGE_MEMBERS)
  addMember(
    @Param('id') id: string,
    @Body() dto: AddMemberDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.addMember(id, dto, userId);
  }

  @Patch(':id/members/:memberId')
  @RequireProjectPermission(ProjectAction.MANAGE_MEMBERS)
  updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.updateMemberRole(id, memberId, dto, userId);
  }

  @Delete(':id/members/:memberId')
  @RequireProjectPermission(ProjectAction.MANAGE_MEMBERS)
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.removeMember(id, memberId, userId);
  }

  @Get(':id/tasks')
  @RequireProjectPermission(ProjectAction.VIEW)
  getProjectTasks(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.projectsService.getProjectTasks(id, userId);
  }
}
