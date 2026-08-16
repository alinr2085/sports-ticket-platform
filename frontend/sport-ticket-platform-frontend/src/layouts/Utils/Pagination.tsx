interface PaginationProps {
  currentPage: number;
  totalPage: number;
  paginate: (pageNumber: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPage,
  paginate,
}: PaginationProps) => {
  const pageNumbers: (number | "...")[] = [];

  if (totalPage <= 1) {
    return null;
  }

  if (totalPage <= 5) {
    for (let i = 0; i < totalPage; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(0);

    if (currentPage > 2) {
      pageNumbers.push("...");
    }

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPage - 2, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPage - 3) {
      pageNumbers.push("...");
    }

    pageNumbers.push(totalPage - 1);
  }

  return (
    <nav className="pagination-wrapper">
      <div className="pagination-new">
        {/* Previous */}
        <button
          className="pagination-button pagination-arrow"
          disabled={currentPage === 0}
          onClick={() => paginate(currentPage - 1)}
        >
          ←
        </button>

        {/* Pages */}
        {pageNumbers.map((number, index) => {
          if (number === "...") {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }

          return (
            <button
              key={number}
              className={`pagination-button ${
                currentPage === number ? "pagination-active" : ""
              }`}
              onClick={() => paginate(number)}
            >
              {number + 1}
            </button>
          );
        })}

        {/* Next */}
        <button
          className="pagination-button pagination-arrow"
          disabled={currentPage === totalPage - 1}
          onClick={() => paginate(currentPage + 1)}
        >
          →
        </button>
      </div>
    </nav>
  );
};
