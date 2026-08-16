export const SpinnerLoading = () => {
  return (
    <div
      className="container d-flex justify-content-center mt-5"
      style={{ height: 400 }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
