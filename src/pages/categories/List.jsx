import React, { useState, useContext, useEffect } from "react";
import Layout from "../../libs/Layout";
import { AppContext } from "../../context/AppContextProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ModalForm from "../../components/Modal";
import { useForm } from "react-hook-form";
import { Button, Modal } from "antd";
import { message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  fetchAllCategories,
  fetchDeleteCategory,
  fetchPostCategory,
} from "../../utils/api/categoriesApi";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

export default function List() {
  const { isOpenModal, setIsOpenModal } = useContext(AppContext);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [dataIdToDelete, setDataIdToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const huydev = [
    {
      name: "STT",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "NAME CATEGORY",
      selector: (row) => row.nameCategory,
      sortable: true,
    },
    {
      name: "OUTSTANDING",
      selector: (row) => row.outstandingCategory,
      sortable: true,
      cell: (row) => (
        <div
          className={`${
            row.outstandingCategory === "outstanding"
              ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
              : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
          }`}
        >
          {row.outstandingCategory === "outstanding"
            ? "Nổi Bật"
            : "Không Nổi Bật"}
        </div>
      ),
    },
    {
      name: "STATUS",
      selector: (row) => row.statusCategory,
      sortable: true,
      cell: (row) => (
        <div
          className={`${
            row.statusCategory === "stocking"
              ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
              : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
          }`}
        >
          {row.statusCategory === "stocking" ? "Còn Hàng" : "Hết Hàng"}
        </div>
      ),
    },

    {
      name: "Actions",
      cell: (row) => (
        <div>
          <Link
            to={`edit/${row.slugCategory}`}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit
          </Link>{" "}
          /{" "}
          <button
            onClick={() => showModal(row.id, row)}
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

  const showModal = (id, item) => {
    setDataIdToDelete(id);
    setCategoryName(item.nameCategory);
    setIsModalDelete(true);
  };
  const handleOk = () => {
    deleteCategoryMutation.mutateAsync(dataIdToDelete);
    setIsModalDelete(false);
  };
  const handleCancel = () => {
    setIsModalDelete(false);
  };

  const deleteCategoryMutation = useMutation((id) => fetchDeleteCategory(id), {
    onSuccess: (response) => {
      if (response.status === true) {
        message.success(`${response.message}`);
      } else {
        message.error(`${response.message}`);
      }
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error(error);
      message.error(`${error}`);
    },
  });

  const { data, isLoading } = useQuery(
    ["categories"],
    () => fetchAllCategories(),
    {
      staleTime: 1000,
    }
  );

  // search

  const filteredData = searchText
    ? data.filter((huyit) =>
        huyit.nameCategory.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;


  // modal

  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false); // set loading button

  const openModal = () => {
    setIsOpenModal(true);
  };
  const closeModal = () => {
    setIsOpenModal(false);
  };

  // form add

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const postCategoryMutation = useMutation((data) => fetchPostCategory(data));

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // const formData = new FormData();
      // formData.append("file", data.imageCategory[0]);

      // const uploadResponse = await axios.post(
      //   `${httpApi}/api/uploadFile`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );

      // const imageUrl = uploadResponse.data.secure_url;
      // data.imageCategory = imageUrl;

      // Add mode
      const response = await postCategoryMutation.mutateAsync(data);
      if (response.status === true) {
        message.success(`${response.message}`);
      } else {
        message.error(`${response.message}`);
      }

      reset();
      closeModal();
      queryClient.invalidateQueries("categories");
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="relative overflow-x-auto">
        <div className="text-right pb-4">
          <button
            onClick={openModal}
            className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add Category
          </button>
        </div>

        <ModalForm
          title={"Category"}
          isOpenModal={isOpenModal}
          onClose={closeModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              Cancel
            </Button>,
            <Button
              key="ok"
              type="primary"
              style={{ background: "#1677ff" }}
              onClick={handleSubmit(onSubmit)}
              loading={isSubmitting}
              icon={
                isSubmitting ? (
                  <LoadingOutlined style={{ color: "white" }} />
                ) : null
              }
            >
              Add
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="nameCategory"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="nameCategory"
                  {...register("nameCategory", { required: true })}
                  placeholder="Macbook ..."
                  className={`${
                    errors.nameCategory ? "border-red-500" : "border-gray-300"
                  } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                {errors.nameCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    * Name category is required
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="statusCategory"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Status
                </label>

                <select
                  id="statusCategory"
                  className={`${
                    errors.statusCategory ? "border-red-500" : "border-gray-300"
                  } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  {...register("statusCategory", { required: true })}
                  defaultValue="" // Update defaultValue attribute
                >
                  <option value="">Vui Lòng Chọn Trạng Thái </option>
                  <option value="stocking">Còn Hàng</option>
                  <option value="out-of-stock">Hết Hàng</option>
                </select>
                {errors.statusCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    * Status is required
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="outstanding"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Outstanding
                </label>

                <select
                  id="outstandingCategory"
                  className={`${
                    errors.outstandingCategory
                      ? "border-red-500"
                      : "border-gray-300"
                  } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  {...register("outstandingCategory", { required: true })}
                  defaultValue=""
                >
                  <option value="">Vui Lòng Chọn Sản Phẩm Nổi Bật</option>
                  <option value="outstanding">Nổi Bật</option>
                  <option value="notstandout">Không Nổi Bật</option>
                </select>
                {errors.outstandingCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    * Outstanding is required
                  </p>
                )}
              </div>
            </div>
          </form>
        </ModalForm>

        <Modal
          title="Delete Category"
          open={isModalDelete}
          onOk={handleOk}
          onCancel={handleCancel}
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
          Are you sure you want to delete the category "{categoryName}" ?
        </Modal>

        <DataTable
          columns={huydev}
          data={filteredData}
          dense={false}
          responsive={true}
          pagination
          selectableRows
        />
      </div>
    </Layout>
  );
}
