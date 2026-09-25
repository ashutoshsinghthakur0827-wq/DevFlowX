function StatCard({ title, value, description, icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className={`stat-icon ${color}`}>
          {icon}
        </div>

        <span className="stat-label">Overview</span>
      </div>

      <h2>{value}</h2>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default StatCard;