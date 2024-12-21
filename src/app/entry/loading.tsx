export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loadingOverlay">
        <div className="loadingSpinner">
          <div className="dot1"></div>
          <div className="dot2"></div>
          <div className="dot3"></div>
        </div>
      </div>
    </div>
  );
}
