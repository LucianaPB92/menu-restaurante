import React, { useEffect } from "react";

const Pagination = ({ items = [], itemsPerPage, currentPage, setCurrentPage, setPaginatedItems }) => {
  const totalPages = items.length > 0 ? Math.ceil(items.length / itemsPerPage) : 1;


  useEffect(() => {
    if (!items || items.length === 0) return;
  
    const indiceUltimoItem = currentPage * itemsPerPage;
    const indicePrimerItem = indiceUltimoItem - itemsPerPage;
    const nuevosItems = items.slice(indicePrimerItem, indiceUltimoItem);
    
    setPaginatedItems((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(nuevosItems)) {
        return nuevosItems;
      }
      return prev;
    });
  }, [items, currentPage, itemsPerPage, setPaginatedItems]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <nav>
      <ul className="pagination justify-content-between mt-3">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={handlePrevious} disabled={currentPage === 1}>
            Anterior
          </button>
        </li>
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={handleNext} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
