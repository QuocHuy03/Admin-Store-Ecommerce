import React, { useState } from "react";
import Layout from "../../libs/Layout";
import DataTable from "react-data-table-component";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllProducts,
  fetchDeleteProduct,
  fetchDeleteProductsByIds,
} from "../../utils/api/productsApi";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { message } from "antd";
import ModalMessage from "../../components/ModalMessage";

export default function List() {
  const queryClient = useQueryClient();
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [dataIdToDelete, setDataIdToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const { data, isLoading, refetch } = useQuery(
    ["products"],
    () => fetchAllProducts(),
    {
      staleTime: 1000,
    }
  );

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
        src={row.imagePaths ? row.imagePaths.split(",")[0] : null}
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

  // modal message

  const showModal = (item) => {
    console.log(item);
    if (item !== null && item !== undefined) {
      setDataIdToDelete(item.id);
      setProductName(item.nameProduct);
    } else {
      console.log("Đã Đúng Select");
    }
    setIsModalDelete(true);
  };

  // delete checker

  const handleRowSelected = (rows) => {
    const selectedIds = rows.selectedRows.map((row) => row.id);
    setSelectedRows(selectedIds);
  };

  const handleOk = () => {
    if (selectedRows && selectedRows.length > 0) {
      handleDeleteSelectedMutation.mutateAsync(selectedRows);
    } else if (dataIdToDelete) {
      deleteCategoryMutation.mutateAsync(dataIdToDelete);
    } else {
      message.error(`Bạn chưa chọn hoặc cung cấp dữ liệu muốn xóa!`);
      setIsModalDelete(false);
      return;
    }
    setIsModalDelete(false);
    setProductName("");
    setDataIdToDelete("");
  };

  const handleCancel = () => {
    setIsModalDelete(false);
    setDataIdToDelete(null);
    setProductName(null);
  };

  const deleteCategoryMutation = useMutation((id) => fetchDeleteProduct(id), {
    onSuccess: (response) => {
      if (response.status === true) {
        message.success(`${response.message}`);
      } else {
        message.error(`${response.message}`);
      }
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error(error);
      message.error(`${error}`);
    },
  });

  const handleDeleteSelectedMutation = useMutation(
    (id) => fetchDeleteProductsByIds(id),
    {
      onSuccess: (response) => {
        if (response.status === true) {
          message.success(`${response.message}`);
          setSelectedRows("");
          setProductName("");
          setDataIdToDelete("");
        } else {
          message.error(`${response.message}`);
        }
        queryClient.invalidateQueries(["products"]);
      },
      onError: (error) => {
        console.error(error);
        message.error(`${error}`);
      },
    }
  );

  // search data

  const filteredData = searchText
    ? data.filter((huyit) =>
        huyit.nameProduct.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  return (
    <Layout>
      <div className="flex justify-between">
        <div className="flex">
          <div className="relative">
            <input
              type="text"
              id="voice-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Data ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              required
            />
          </div>

          <button
            onClick={() => showModal(null)}
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 ml-2"
          >
            Delete Selected
          </button>
        </div>
        <Link
          to={`/product/add`}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ml-2"
        >
          Add
        </Link>
      </div>
      <ModalMessage
        title="Delete Product"
        openModal={isModalDelete}
        onSubmitOk={handleOk}
        onClose={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            style={{ background: "red" }}
            onClick={handleOk}
          >
            OK
          </Button>,
        ]}
      >
        Are you sure you want to delete the{" "}
        {productName ? "product" : "products"} "
        {productName ? productName : selectedRows.length}" ?
      </ModalMessage>
      <DataTable
        columns={huydev}
        data={filteredData}
        dense={false}
        responsive={true}
        pagination
        selectableRows
        onSelectedRowsChange={handleRowSelected}
      />
    </Layout>
  );
}
