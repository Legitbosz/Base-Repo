export default function Stats({ stats }) {
  const total = parseFloat(stats.total);
  const balance = parseFloat(stats.balance);

  // Format nicely — show more decimals only if very small
  const fmt = (n) => {
    if (n === 0) return "0";
    if (n < 0.0001) return n.toExponential(2);
    if (n < 0.01) return n.toFixed(6);
    return n.toFixed(4);
  };

  return (
    <div className="stats-row">
      <div className="stat-card">
        <span className="stat-icon">💸</span>
        <div className="stat-value">{fmt(total)}</div>
        <div className="stat-label">ETH Tipped</div>
      </div>
      <div className="stat-card">
        <span className="stat-icon">🎯</span>
        <div className="stat-value">{stats.count}</div>
        <div className="stat-label">Tips Sent</div>
      </div>
      <div className="stat-card">
        <span className="stat-icon">🫙</span>
        <div className="stat-value">{fmt(balance)}</div>
        <div className="stat-label">ETH in Jar</div>
      </div>
    </div>
  );
}
