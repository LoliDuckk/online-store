import { Pagination } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../main";
import { useNavigate, useLocation } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";

const Pages = observer(() => {
  const { device } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const pageCount = Math.ceil(device.totalCount / device.limit);
  const params = new URLSearchParams(location.search);
  const currentPage = Number(params.get("page")) || 1;

  const handlePageClick = (page) => {
    if (page < 1 || page > pageCount || page === currentPage) return;

    params.set("page", page);
    navigate({
      pathname: SHOP_ROUTE,
      search: params.toString(),
    });
  };

  const renderPages = () => {
    const pageItems = [];

    const addPage = (p) => {
      const isActive = p === currentPage;
      pageItems.push(
        <Pagination.Item
          key={p}
          active={isActive}
          onClick={() => handlePageClick(p)}
          style={{
            backgroundColor: isActive ? "#ffc107" : "transparent",
            borderColor: "#ffc107",
            color: isActive ? "#212529" : "#ffc107",
          }}
        >
          {p}
        </Pagination.Item>
      );
    };

    const addEllipsis = (key) => {
      pageItems.push(
        <Pagination.Ellipsis
          key={`ellipsis-${key}`}
          disabled
          style={{ color: "#ffc107" }}
        />
      );
    };

    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) {
        addPage(i);
      }
    } else {
      addPage(1);

      if (currentPage > 4) addEllipsis("start");

      for (
        let i = Math.max(2, currentPage - 2);
        i <= Math.min(pageCount - 1, currentPage + 2);
        i++
      ) {
        addPage(i);
      }

      if (currentPage < pageCount - 3) addEllipsis("end");

      addPage(pageCount);
    }

    return pageItems;
  };

  return (
    <>
      <Pagination className="mt-3">
        <Pagination.Prev
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {renderPages()}
        <Pagination.Next
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === pageCount}
        />
      </Pagination>
      <style>
        {`
        .pagination .page-item .page-link {
          color: #ffc107;
        }
        .pagination .page-item.active .page-link {
          background-color: #ffc107;
          border-color: #ffc107;
          color: #212529;
        }
      `}
      </style>
    </>
  );
});

export default Pages;
