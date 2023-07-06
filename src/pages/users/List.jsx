import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchAllUsers } from "../../utils/api/userApi";
import Layout from "../../libs/Layout";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

export default function List() {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useQuery(["users"], () => fetchAllUsers(), {
    staleTime: 1000,
  });

  const huydev = [
    {
      name: "STT",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "USERNAME",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "FULLNAME",
      selector: (row) => row.fullname,
      sortable: true,
    },
    {
      name: "PHONE",
      selector: (row) => row.phone ? row.phone : "Chưa Cập Nhật",
      sortable: true,
    },
    {
      name: "ADDRESS",
      selector: (row) => row.address ? row.address : "Chưa Cập Nhật",
      sortable: true,
    },
    {
      name: "ROLE",
      selector: (row) => row.role,
      sortable: true,
    },

    {
      name: "ACTIONS",
      cell: (row) => (
        <div>
          <button
            onClick={() => showModal(row)}
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

  // search data

  const filteredData = searchText
    ? data.filter((huyit) =>
        huyit.username.toLowerCase().includes(searchText.toLowerCase())
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
        selectableRows
        // onSelectedRowsChange={handleRowSelected}
      />
    </Layout>
  );
}
