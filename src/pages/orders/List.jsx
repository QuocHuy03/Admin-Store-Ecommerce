import React, { useContext, useState } from "react";
import Layout from "../../libs/Layout";
import DataTable from "react-data-table-component";
import { useQuery } from "@tanstack/react-query";
import { fetchAllOrders } from "../../utils/api/ordersApi";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContextProvider";
import ModalForm from "../../components/ModalForm";
import { Button, Table } from "antd";

export default function List() {
  const { isOpenModal, setIsOpenModal } = useContext(AppContext);
  const [searchText, setSearchText] = useState("");
  const [isDetailProduct, setIsDetailProduct] = useState([]);
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
          <button
            onClick={() => openModal(row)}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Chi Tiết
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const openModal = (data) => {
    setIsDetailProduct(JSON.parse(data.productOrder));
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setIsDetailProduct();
  };

  const maskClosable = () => {
    setIsOpenModal(false);
    setIsDetailProduct();
  };

  const detailOrder = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "IMAGE",
      dataIndex: "image",
      render: (imageURL) => (
        <img src={imageURL} alt="Product" style={{ width: "100px" }} />
      ),
    },
    {
      title: "COLOR",
      dataIndex: "color",
      filters: [
        {
          text: "Black",
          value: "black",
        },
        {
          text: "Red",
          value: "red",
        },
      ],
      onFilter: (value, record) => record.color.indexOf(value) === 0,
      render: (color) => (
        <span
          style={{
            color: color === "black" ? "black" : "red",
            textTransform: "uppercase",
          }}
        >
          {color}
        </span>
      ),
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "PRICE",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => <span>{price.toLocaleString()}</span>,
    },
  ];

  const getFirstImageURL = (images) => {
    const imageURLs = images.split(",");
    return imageURLs.length > 0 ? imageURLs[0] : "";
  };
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

      <ModalForm
        title={"List Product"}
        isOpenModal={isOpenModal}
        onClose={closeModal}

        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>
        ]}
      >
        <Table
          columns={detailOrder}
          dataSource={isDetailProduct?.map((order) => ({
            ...order,
            key: order.id,
            image: getFirstImageURL(order.image),
          }))}
          rowKey="id"
          pagination={{
            position: "bottom",
            pageSize: 5,
          }}
        />
      </ModalForm>
    </Layout>
  );
}
