import {
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

import "./Notifications.css";

function Notifications({
  notifications,
  onDismiss,
}) {
  return (
    <div className="notifications">
      {notifications.map(
        (notification) => {
          const Icon =
            notification.type ===
            "success"
              ? CheckCircle2
              : Info;

          return (
            <article
              className="notification"
              key={
                notification.id
              }
            >
              <div className="notification-icon">
                <Icon size={17} />
              </div>

              <div className="notification-content">
                <strong>
                  {notification.title}
                </strong>

                <p>
                  {
                    notification.message
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onDismiss(
                    notification.id
                  )
                }
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </article>
          );
        }
      )}
    </div>
  );
}

export default Notifications;