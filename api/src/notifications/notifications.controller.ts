import {
    Controller,
    Get,
    Patch,
    Param,
    UseGuards,
    Req,
} from '@nestjs/common'

import { NotificationsService } from './notifications.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('notifications')
export class NotificationsController {

    constructor(private notificationsService: NotificationsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getMyNotifications(@Req() req: any) {
        return this.notificationsService.getUserNotifications(req.user.sub)
    }

    @UseGuards(JwtAuthGuard)
    @Get('unread-count')
    getUnreadCount(@Req() req: any) {
        return this.notificationsService.getUnreadCount(req.user.sub)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('read-all')
    markAllAsRead(@Req() req: any) {
        return this.notificationsService.markAllAsRead(req.user.sub)
    }
}
