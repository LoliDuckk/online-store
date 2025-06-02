// src/components/Pages.jsx
import { Pagination } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../main";
import { useNavigate, useLocation } from "react-router-dom";

const Pages = observer(() => {
  const { device } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const pageCount = Math.ceil(device.totalCount / device.limit);
  const pages = [];
  for (let i = 1; i <= pageCount; i++) {
    pages.push(i);
  }

  const handlePageClick = (page) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    navigate({
      pathname: "/shop",
      search: params.toString(),
    });
  };

  return (
    <Pagination className="mt-3">
      {pages.map((p) => (
        <Pagination.Item
          key={p}
          active={device.page === p}
          onClick={() => handlePageClick(p)}
        >
          {p}
        </Pagination.Item>
      ))}
    </Pagination>
  );
});

export default Pages;
