import React from "react";
import PageHeader from "../components/common/PageHeader";
import { useNotificationsList } from "../features/notifications/hooks/useNotifications";
import type { NotificationType } from "../features/notifications/services/notification.service";
import "./Notifications.css";

const TYPE_LABEL: Record<string, string> = {
  APPOINTMENT_REMINDER: "Recordatorio de cita",
  DAILY_AGENDA: "Agenda diaria",
};

const TYPE_ICON: Record<string, string> = {
  APPOINTMENT_REMINDER: "date.svg",
  DAILY_AGENDA: "documents.svg",
};

const formatRelativeDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NotificationsPage: React.FC = () => {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotificationsList();
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <>
      <PageHeader
        title="Notificaciones"
        subtitle="Recordatorios de citas · Agenda diaria"
        onClick={hasUnread ? markAllAsRead : undefined}
        textButton="Marcar todas como leídas"
      />

      <div className="notifications-list">
        {loading ? (
          <div className="empty-state-v2">Cargando notificaciones...</div>
        ) : notifications.length === 0 ? (
          <div className="empty-state-v2">No tienes notificaciones.</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${notification.isRead ? "" : "unread"}`}
            >
              <div className="notification-icon">
                <img
                  src={`/icons/${TYPE_ICON[notification.type as NotificationType] ?? "bell.svg"}`}
                  alt=""
                  className="icon-img-color"
                  width={20}
                />
              </div>

              <div className="notification-body">
                <div className="notification-top-row">
                  <span className="notification-type">
                    {TYPE_LABEL[notification.type as NotificationType] ?? "Notificación"}
                  </span>
                  <span className="notification-date">
                    {formatRelativeDate(notification.createdAt)}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>

              {!notification.isRead && (
                <button
                  className="back-link notification-read-btn"
                  onClick={() => markAsRead(notification.id)}
                >
                  Marcar como leída
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default NotificationsPage;
