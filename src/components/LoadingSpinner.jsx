function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Generating your professional content...</p>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
        This may take a few moments
      </p>
    </div>
  );
}

export default LoadingSpinner;
