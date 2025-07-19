import { useState, useEffect } from "react";

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [backendStatus, setBackendStatus] = useState("unknown");
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkBackendStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setBackendStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check backend status on mount
    checkBackendStatus();

    // Check backend status every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  const checkBackendStatus = async () => {
    try {
      // Use same logic as ApiService for consistency
      const getApiBaseUrl = () => {
        if (process.env.REACT_APP_API_BASE_URL) {
          return process.env.REACT_APP_API_BASE_URL;
        }

        if (process.env.REACT_APP_BACKEND_URL) {
          return process.env.REACT_APP_BACKEND_URL + "/api";
        }

        if (process.env.BACKEND_URL) {
          return process.env.BACKEND_URL + "/api";
        }

        // Development fallback - Docker/Podman setup
        if (process.env.NODE_ENV === "development") {
          return "http://localhost:8080/api";
        }

        // Production fallback
        return "/backend/api";
      };

      const response = await fetch(getApiBaseUrl() + "/health.php", {
        method: "GET",
        timeout: 5000,
      });

      if (response.ok) {
        setBackendStatus("online");
      } else {
        setBackendStatus("error");
      }
    } catch (error) {
      setBackendStatus("offline");
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return "#e74c3c"; // Red for offline
    if (backendStatus === "online") return "#27ae60"; // Green for online
    if (backendStatus === "error") return "#f39c12"; // Orange for error
    return "#95a5a6"; // Gray for unknown
  };

  const getStatusText = () => {
    if (!isOnline) return "Tidak ada koneksi internet";
    if (backendStatus === "online") return "Terhubung ke server";
    if (backendStatus === "error") return "Server bermasalah";
    if (backendStatus === "offline") return "Server tidak dapat diakses";
    return "Memeriksa koneksi...";
  };

  const getStatusIcon = () => {
    if (!isOnline) return "🔴";
    if (backendStatus === "online") return "🟢";
    if (backendStatus === "error") return "🟡";
    return "⚪";
  };

  // Show status indicator if there are issues
  const shouldShow = !isOnline || backendStatus !== "online";

  if (!shouldShow && !showStatus) {
    return (
      <div
        className="network-status-toggle"
        onClick={() => setShowStatus(true)}
        title="Klik untuk melihat status koneksi"
      >
        {getStatusIcon()}
      </div>
    );
  }

  return (
    <div className={`network-status ${shouldShow ? "show" : ""}`}>
      <div className="status-indicator">
        <div
          className="status-dot"
          style={{ backgroundColor: getStatusColor() }}
        ></div>
        <span className="status-text">{getStatusText()}</span>
        {showStatus && !shouldShow && (
          <button className="close-status" onClick={() => setShowStatus(false)}>
            ×
          </button>
        )}
      </div>

      {(backendStatus === "offline" || backendStatus === "error") && (
        <div className="status-actions">
          <button onClick={checkBackendStatus} className="retry-connection">
            🔄 Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
}

export default NetworkStatus;
