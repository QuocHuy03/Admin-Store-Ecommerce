import React from "react";
import Layout from "../../libs/Layout";
import DataTable from "react-data-table-component";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "../../utils/api/categoriesApi";

export default function List() {
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
      selector: (row) => row.imageProducts,
      sortable: true,
    },
    {
      name: "CATEGORY",
      selector: (row) => row.categoryID,
      sortable: true,
    },
    {
      name: "PRICE INITIAL",
      selector: (row) => row.initial_price,
      sortable: true,
    },
    {
      name: "PRICE ROPED",
      selector: (row) => row.price_has_ropped,
      sortable: true,
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
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            onClick={() => editModal(row.id, row)}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit
          </button>{" "}
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

  const { data, isLoading, refetch } = useQuery(
    ["products"],
    () => fetchAllCategories(),
    {
      staleTime: 1000,
    }
  );

  return (
    <Layout>
      <DataTable
        columns={huydev}
        data={data}
        dense={false} 
        responsive={true}
        pagination
        selectableRows
      />
    </Layout>
  );
}
