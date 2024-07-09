import { useState } from "react";

export default function Pagination({
    currentPage,
    totalPages,
    onNext,
    onPrev,
    handlePageChange,
}) {
    // const [currentPage, setCurrentPage] = useState(1);
    const maxPagesToShow = 5; // Number of page numbers to show
    // const paginate = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };
    const getPageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= maxPagesToShow) {
            // If total pages is less than or equal to maxPagesToShow, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // If total pages is greater than maxPagesToShow, show subset with ellipsis
            const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
            let startPage = currentPage - halfMaxPagesToShow;
            let endPage = currentPage + halfMaxPagesToShow;

            if (startPage <= 0) {
                startPage = 1;
                endPage = maxPagesToShow;
            }

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = totalPages - maxPagesToShow + 1;
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (startPage > 1) {
                pageNumbers.unshift("...");
            }
            if (endPage < totalPages) {
                pageNumbers.push("...");
            }
        }

        return pageNumbers;
    };

    return (
        <div>
            {/* Pagination controls */}
            <div className="d-flex justify-content-center">
                {/* Previous button */}
                <button
                    className="pagination__next"
                    onClick={() => onPrev(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    {" "}
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M14.9998 20.67C14.8098 20.67 14.6198 20.6 14.4698 20.45L7.94979 13.93C6.88979 12.87 6.88979 11.13 7.94979 10.07L14.4698 3.55002C14.7598 3.26002 15.2398 3.26002 15.5298 3.55002C15.8198 3.84002 15.8198 4.32002 15.5298 4.61002L9.00979 11.13C8.52979 11.61 8.52979 12.39 9.00979 12.87L15.5298 19.39C15.8198 19.68 15.8198 20.16 15.5298 20.45C15.3798 20.59 15.1898 20.67 14.9998 20.67Z"
                            fill="currentcolor"
                        />
                    </svg>
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((pageNumber, index) => (
                    <button
                        className={`pagination__item ${currentPage === pageNumber ? "active" : ""
                            }`}
                        key={index}
                        onClick={() => {
                            if (pageNumber !== "...") {
                                handlePageChange(pageNumber);
                            }
                        }}
                        disabled={pageNumber === "..."}
                    >
                        {pageNumber}
                    </button>
                ))}
                {/* Next button */}
                <button
                    className="pagination__next"
                    onClick={() => onNext(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8.9101 20.67C8.7201 20.67 8.5301 20.6 8.3801 20.45C8.0901 20.16 8.0901 19.68 8.3801 19.39L14.9001 12.87C15.3801 12.39 15.3801 11.61 14.9001 11.13L8.3801 4.61002C8.0901 4.32002 8.0901 3.84002 8.3801 3.55002C8.6701 3.26002 9.1501 3.26002 9.4401 3.55002L15.9601 10.07C16.4701 10.58 16.7601 11.27 16.7601 12C16.7601 12.73 16.4801 13.42 15.9601 13.93L9.4401 20.45C9.2901 20.59 9.1001 20.67 8.9101 20.67Z"
                            fill="currentcolor"
                        />
                    </svg>
                </button>
            </div>
        </div>       
    );
}
