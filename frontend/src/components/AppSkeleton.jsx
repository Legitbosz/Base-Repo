const styles = `
  .skeleton-pulse {
    animation: skeletonPulse 1.4s ease-in-out infinite;
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 200% 100%;
  }
  @keyframes skeletonPulse {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .skeleton-block {
    border-radius: 12px;
    height: 20px;
    margin-bottom: 10px;
  }
  .skeleton-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;
  }
  .skeleton-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  .skeleton-circle {
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

function Bone({ width = "100%", height = 18, style = {} }) {
  return (
    <div
      className="skeleton-block skeleton-pulse"
      style={{ width, height, ...style }}
    />
  );
}

export default function AppSkeleton() {
  return (
    <>
      <style>{styles}</style>
      <div className="app" style={{ opacity: 1 }}>
        {/* Header skeleton */}
        <header className="header">
          <Bone width={120} height={28} />
          <Bone width={140} height={36} style={{ borderRadius: 999 }} />
        </header>

        {/* Hero skeleton */}
        <section style={{ padding: "64px 0 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <Bone width={100} height={14} style={{ marginBottom: 20 }} />
            <Bone width="70%" height={52} style={{ marginBottom: 12 }} />
            <Bone width="55%" height={52} style={{ marginBottom: 20 }} />
            <Bone width="60%" height={18} />
          </div>
          <div
            className="skeleton-pulse skeleton-circle"
            style={{ width: 160, height: 200, borderRadius: 80, flexShrink: 0 }}
          />
        </section>

        {/* Main grid skeleton */}
        <div className="main-grid">
          <div className="left-col">
            {/* Stats */}
            <div className="skeleton-row">
              {[1,2,3].map(i => (
                <div key={i} className="skeleton-card" style={{ flex: 1, margin: 0 }}>
                  <Bone width={40} height={14} style={{ margin: "0 auto 8px" }} />
                  <Bone width={80} height={24} style={{ margin: "0 auto 6px" }} />
                  <Bone width={60} height={12} style={{ margin: "0 auto" }} />
                </div>
              ))}
            </div>
            {/* TipForm */}
            <div className="skeleton-card">
              <Bone width={120} height={20} style={{ marginBottom: 20 }} />
              <Bone width="100%" height={44} style={{ marginBottom: 12 }} />
              <Bone width="80%" height={36} style={{ marginBottom: 12 }} />
              <Bone width="100%" height={80} style={{ marginBottom: 12 }} />
              <Bone width="100%" height={48} style={{ borderRadius: 999 }} />
            </div>
          </div>
          <div className="right-col">
            {/* TipFeed */}
            <div className="skeleton-card" style={{ flex: 1 }}>
              <Bone width={100} height={20} style={{ marginBottom: 20 }} />
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton-row" style={{ marginBottom: 16 }}>
                  <div className="skeleton-pulse skeleton-circle" style={{ width: 40, height: 40 }} />
                  <div style={{ flex: 1 }}>
                    <Bone width="60%" height={14} style={{ marginBottom: 6 }} />
                    <Bone width="40%" height={12} />
                  </div>
                  <Bone width={70} height={14} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
