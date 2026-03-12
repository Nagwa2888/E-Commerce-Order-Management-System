export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationMessage {
  id: string;
  type: NotificationType;
  message: string;
  createdAtUtc: string;
  read?: boolean;
}
