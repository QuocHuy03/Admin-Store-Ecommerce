import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../../libs/Layout";
import DataTable from "react-data-table-component";
import { useQuery } from "@tanstack/react-query";
import { fetchAllOrders } from "../../utils/api/ordersApi";

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
      name: "NAME",
      selector: (row) => row.nameProduct,
      sortable: true,
    },
    {
      name: "IMAGE",
      cell: (row) => (
        <img
          src={row.imagePaths.split(",")[0]}
          alt="Product Image"
          style={{ width: "50px", height: "50px" }}
        />
      ),
      sortable: true,
    },
    {
      name: "CATEGORY",
      selector: (row) => row.nameCategory,
      sortable: true,
    },
    {
      name: "PRICE INITIAL",
      selector: (row) => row.initial_price,
      sortable: true,
      cell: (row) => <span>{row.initial_price.toLocaleString()} VND</span>,
    },
    {
      name: "PRICE ROPED",
      selector: (row) => row.price_has_ropped,
      sortable: true,
      cell: (row) => <span>{row.price_has_ropped.toLocaleString()} VND</span>,
    },
    {
      name: "STATUS",
      selector: (row) => row.statusProduct,
      sortable: true,
      cell: (row) => (
        <div
          className={`${
            row.statusProduct === "stocking"
              ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
              : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
          }`}
        >
          {row.statusProduct === "stocking" ? "Còn Hàng" : "Hết Hàng"}
        </div>
      ),
    },
    {
      name: "ACTIONS",
      cell: (row) => (
        <div>
          <Link
            to={`/product/edit/${row.slugProduct}`}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit
          </Link>{" "}
          /{" "}
          <button
            onClick={() => showModal(row)}
            className="font-medium text-red-600 dark:text-blue-500 hover:underline"
          >
            Delete
          </button>
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
