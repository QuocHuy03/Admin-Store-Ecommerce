import React from "react";
import Layout from "../../libs/Layout";
import DataTable from "react-data-table-component";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "../../utils/api/categoriesApi";

export default function List() {
  const columns = [
    {
      name: "Title",
      selector: (row) => row.nameCategory,
      sortable: true,
    },
    {
      name: "Year",
      selector: (row) => row.outstandingCategory,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button onClick={() => handleEdit(row)}>Edit</button>
          <button onClick={() => handleDelete(row)}>Delete</button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  const { data, isLoading, refetch } = useQuery(
    ["categories"],
    () => fetchAllCategories(),
    {
      staleTime: 1000,
    }
  );

  return (
    <Layout>
      <DataTable
        columns={columns}
        data={data}
        dense={false} 
        responsive={true}
        pagination
        selectableRows
      />
    </Layout>
  );
}
