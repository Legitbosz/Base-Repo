const styles = `
  .spinner-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 24px;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(99, 102, 241, 0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .spinner.spinner-sm {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }

  .spinner.spinner-lg {
    width: 52px;
    height: 52px;
    border-width: 4px;
  }

  .spinner-label {
    font-size: 0.82rem;
    color: var(--text3, #5a5a72);
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.05em;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/**
 * Reusable loading spinner component
 *
 * @param {string} size - "sm" | "md" | "lg" (default "md")
 * @param {string} label - Optional label below spinner
 * @param {boolean} inline - If true, renders without wrapper padding
 */
export default function LoadingSpinner({ size = "md", label, inline = false }) {
  return (
    <>
      <style>{styles}</style>
      <div className={inline ? "" : "spinner-wrapper"}>
        <div className={`spinner ${size === "sm" ? "spinner-sm" : size === "lg" ? "spinner-lg" : ""}`} />
        {label && <span className="spinner-label">{label}</span>}
      </div>
    </>
  );
}
