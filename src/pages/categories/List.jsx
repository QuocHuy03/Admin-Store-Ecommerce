import React, { useContext, useState } from "react";
import Layout from "../../libs/Layout";
import { AppContext } from "../../context/AppContextProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import Modal from "../../components/Modal";
import { useForm } from "react-hook-form";
import axios from "axios";
import { message } from "antd";
import {
  fetchAllCategories,
  fetchPostCategory,
} from "../../utils/api/categoriesApi";
import { httpApi } from "../../dev";
import Loading from "../../components/Loading";

export default function List() {
  const { isOpenModal, setIsOpenModal } = useContext(AppContext);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories(),
    staleTime: 1000,
  });

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

  const postJobMutation = useMutation((data) => fetchPostCategory(data));

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", data.imageCategory[0]);

      const uploadResponse = await axios.post(
        `${httpApi}/api/uploadFile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = uploadResponse.data.secure_url;
      data.imageCategory = imageUrl;

      const response = await postJobMutation.mutateAsync(data);
      if (response.status === true) {
        message.success(`${response.message}`);
      } else {
        message.error(`${response.message}`);
      }
      reset();
      closeModal();
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
            />
          </div>
          <button
            onClick={openModal}
            className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add Category
          </button>
        </div>

        <Modal
          nameModal={"Add Category"}
          isOpenModal={isOpenModal}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Modal body */}
            <div className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name Category
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
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="imageCategory"
                  >
                    Image Category File (.png, .jpg) ...
                  </label>
                  <input
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      errors.imageCategory
                        ? "border-red-500"
                        : "border-gray-300"
                    }
                      cp76h cuw4o`}
                    id="imageCategory"
                    accept=".png,.jpg"
                    type="file"
                    {...register("imageCategory", { required: true })}
                  />
                  {errors.imageCategory && (
                    <p className="text-red-500 text-sm mt-1">
                      * Image Category is required
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
                      errors.statusCategory
                        ? "border-red-500"
                        : "border-gray-300"
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
            </div>

            {/* Modal footer */}
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              {isSubmitting ? (
                <button
                  disabled
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 cursor-not-allowed "
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading
                </button>
              ) : (
                <button
                  type="submit"
                  className=" text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Add
                </button>
              )}
              <button
                type="button"
                onClick={closeModal}
                className=" text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Close
              </button>
            </div>
          </form>
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
              {data.map((item, index) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center"
                  key={item.id}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index}
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
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        <nav className="pt-4 text-center">
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <a
                href="#"
                className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Previous</span>
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
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                2
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-current="page"
                className="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                3
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                4
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                5
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Next</span>
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
