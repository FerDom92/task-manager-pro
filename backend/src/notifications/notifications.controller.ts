import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationsService.findAll(userId, unreadOnly === 'true');
  }

  @Get('count')
  getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notificationsService.delete(id, userId);
  }

  @Delete()
  deleteAll(@CurrentUser('id') userId: string) {
    return this.notificationsService.deleteAll(userId);
  }
}
