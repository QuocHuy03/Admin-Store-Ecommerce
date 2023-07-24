import React, { useState } from "react";
import Layout from "../../libs/Layout";
import DataTable from "react-data-table-component";
import { useQuery } from "@tanstack/react-query";
import { fetchAllOrders } from "../../utils/api/ordersApi";
import { Link } from "react-router-dom";

export default function List() {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useQuery(["orders"], () => fetchAllOrders(), {
    staleTime: 1000,
  });

  const huydev = [
    {
      name: "STT",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "CODE",
      selector: (row) => row.code,
      sortable: true,
    },
    {
      name: "TOTAL PRICE",
      cell: (row) => <span>{row.totalPrice.toLocaleString()} VND</span>,
      sortable: true,
    },
    {
      name: "PAYMENT METHOD",
      cell: (row) => <span className="uppercase">{row.paymentMethod}</span>,
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div
          className={`${
            row.status === "Đã Thanh Toán"
              ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
              : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
          }`}
        >
          {row.status}
        </div>
      ),
    },
    {
      name: "ACTION",
      cell: (row) => (
        <div>
          <Link
            to={`/order-detail/${row.code}`}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Chi Tiết
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // search data

  const filteredData = searchText
    ? data.filter((huyit) =>
        huyit.nameProduct.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  return (
    <Layout>
      <DataTable
        columns={huydev}
        data={filteredData}
        dense={false}
        responsive={true}
        pagination
      />
    </Layout>
  );
}
