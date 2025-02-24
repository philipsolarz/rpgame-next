export interface Notification {
    id: string;
    user_id: string;
    content: string;
    read: boolean;
    created_at: string;
    updated_at?: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
}

export interface NotificationResponse {
    notification: Notification;
}

export interface NotificationCreateRequest {
    user_id: string;
    content: string;
}

export interface NotificationCreateResponse {
    notification: Notification;
}

export interface NotificationUpdateRequest {
    read?: boolean;
}

export interface NotificationUpdateResponse {
    notification: Notification;
}

export interface NotificationDeleteResponse {
    message: string;
}
