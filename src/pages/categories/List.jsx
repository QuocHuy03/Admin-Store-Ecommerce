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
  fetchAllCategoriesPage,
  fetchDeleteCategory,
  fetchPostCategory,
} from "../../utils/api/categoriesApi";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import { paginateEnv } from "../../dev";

export default function List() {
  const { isOpenModal, setIsOpenModal } = useContext(AppContext);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [dataIdToDelete, setDataIdToDelete] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [paginate, setPaginate] = useState({
    page: paginateEnv.page,
    limit: paginateEnv.limit,
  });

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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categories", , paginate.page, paginate.limit],
    queryFn: () => fetchAllCategoriesPage(paginate.page, paginate.limit),
    staleTime: 1000,
  });

  // panigate

  const handlePageChange = (pageNumber) => {
    setPaginate((prevPaginate) => ({
      ...prevPaginate,
      page: pageNumber,
    }));
  };

  useEffect(() => {
    refetch();
  }, [paginate.page, paginate.limit, refetch]);

  // filter table

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    if (searchTerm) {
      // Lọc dữ liệu dựa vào giá trị search
      const filteredDataHuy = Array.isArray(data?.data)
        ? data.data.filter((item) =>
            item.nameCategory.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

      data.data = filteredDataHuy;
    } else {
      queryClient.invalidateQueries("categories");
    }
  }, [searchTerm, data?.data]);

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
      <div className="relative overflow-x-auto">
        <div className="flex items-center justify-between pb-4">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for items"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
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

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="text-center">
              <th scope="col" className="px-6 py-3">
                STT
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center justify-center">
                  Name
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 ml-1"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                    </svg>
                  </a>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center justify-center">
                  Outstanding
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 ml-1"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                    </svg>
                  </a>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center justify-center">
                  Status
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 ml-1"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                    </svg>
                  </a>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center justify-center">
                  Action
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 ml-1"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                    </svg>
                  </a>
                </div>
              </th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <tr className="text-center">
                <td
                  colSpan="5"
                  style={{ verticalAlign: "middle", paddingTop: 20 }}
                >
                  <Loading />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data.data.map((item, index) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center"
                  key={item.id}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">{item.nameCategory}</td>
                  <td className="px-6 py-4">
                    <p
                      className={`${
                        item.outstandingCategory === "outstanding"
                          ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
                          : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
                      }`}
                    >
                      {item.outstandingCategory === "outstanding"
                        ? "Nổi Bật"
                        : "Không Nổi Bật"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`${
                        item.statusCategory === "stocking"
                          ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
                          : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
                      }`}
                    >
                      {item.statusCategory === "stocking"
                        ? "Còn Hàng"
                        : "Hết Hàng"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`edit/${item.slugCategory}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                    {" / "}
                    <button
                      onClick={() => showModal(item.id, item)}
                      className="font-medium text-red-600 dark:text-blue-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        <nav className="pt-4 text-center">
          <ul className="inline-flex items-center -space-x-px">
            <li>
              {/* Previous page button */}
              <a
                className={`block px-3 py-2 ml-0 leading-tight ${
                  data?.currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                } bg-white border border-gray-300 rounded-l-lg`}
                onClick={() => handlePageChange(data?.currentPage - 1)}
              >
                <span className="sr-only">Previous</span>
                {/* Previous page icon */}
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
            {/* Page numbers */}
            {Array.from({ length: data?.totalPages }, (_, index) => (
              <li key={index}>
                <a
                  className={`${
                    data?.currentPage === index + 1
                      ? "z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      : "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </a>
              </li>
            ))}
            <li>
              {/* Next page button */}
              <a
                className={`block px-3 py-2 leading-tight ${
                  data?.currentPage === data?.totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                } bg-white border border-gray-300 rounded-r-lg`}
                onClick={() => {
                  if (data?.currentPage !== data?.totalPages) {
                    handlePageChange(data?.currentPage + 1);
                  }
                }}
              >
                <span className="sr-only">Next</span>
                {/* Next page icon */}
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </Layout>
  );
}
