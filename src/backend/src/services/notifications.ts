import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { notifications } from '../db/schema.js';

export class NotificationService {
  constructor(private db: NodePgDatabase) {}

  // Send push notification (integrate with Firebase Cloud Messaging)
  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> {
    // TODO: Integrate with FCM
    // For now, just save to database
    await this.db.insert(notifications).values({
      userId,
      type: 'system',
      title,
      body,
      data,
    });
  }

  // Send to multiple users
  async sendBulkNotifications(
    userIds: string[],
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> {
    const inserts = userIds.map(userId => ({
      userId,
      type: 'system' as const,
      title,
      body,
      data,
    }));

    await this.db.insert(notifications).values(inserts);
  }
}
