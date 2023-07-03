import React, { useState } from "react";
import Layout from "../../libs/Layout";
import { useForm } from "react-hook-form";
import { fetchPostProduct } from "../../utils/api/productsApi";
import { useMutation } from "@tanstack/react-query";

export default function Add() {
  const [isSubmitting, setIsSubmitting] = useState(false); // set loading button
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const postProductMutation = useMutation((data) => fetchPostProduct(data));

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

      // Add , Update

      // Add mode
      const response = await postProductMutation.mutateAsync(data);
      if (response.status === true) {
        message.success(`${response.message}`);
      } else {
        message.error(`${response.message}`);
      }

      reset();
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };
  return (
    <Layout>
      <form>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="nameProduct"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name Product
            </label>

            <input
              type="text"
              id="nameProduct"
              className={`${
                errors.nameProduct ? "border-red-500" : "border-gray-300"
              } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              {...register("nameProduct", { required: true })}
              placeholder="Asus GB5 ..."
            />
            {errors.nameProduct && (
              <p className="text-red-500 text-sm mt-1">
                * Name Product is required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="price_has_ropped"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Giá Đã Giảm
            </label>
            <input
              type="number"
              id="price_has_ropped"
              className={`${
                errors.price_has_ropped ? "border-red-500" : "border-gray-300"
              } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              {...register("price_has_ropped", { required: true })}
              placeholder="1000"
            />
            {errors.price_has_ropped && (
              <p className="text-red-500 text-sm mt-1">
                * Price Has ropped is required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="categoryID"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Categories
            </label>
            <select
              id="categoryID"
              className={`${
                errors.categoryID ? "border-red-500" : "border-gray-300"
              } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              {...register("categoryID", { required: true })}
            >
              <option value="">Vui Lòng Chọn Trạng Thái</option>
            </select>
            {errors.categoryID && (
              <p className="text-red-500 text-sm mt-1">
                * Categories is required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="initial_price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Giá Ban Đầu
            </label>
            <input
              type="number"
              id="initial_price"
              className={`${
                errors.initial_price ? "border-red-500" : "border-gray-300"
              } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              {...register("initial_price", { required: true })}
              placeholder="10000"
            />
            {errors.initial_price && (
              <p className="text-red-500 text-sm mt-1">
                * Initial price is required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="contentProduct"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nội Dung
            </label>

            <textarea
              id="contentProduct"
              rows="4"
              className={`${
                errors.contentProduct ? "border-red-500" : "border-gray-300"
              } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              {...register("contentProduct", { required: true })}
              placeholder="Nội Dung"
            ></textarea>

            {errors.contentProduct && (
              <p className="text-red-500 text-sm mt-1">
                * Content Product is required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="statusProduct"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Status
            </label>

            <select
              id="statusProduct"
              className={`${
                errors.statusProduct ? "border-red-500" : "border-gray-300"
              } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              {...register("statusProduct", { required: true })}
            >
              <option value="">Vui Lòng Chọn Trạng Thái</option>
              <option value="stocking">Còn Hàng</option>
              <option value="out-of-stock">Hết Hàng</option>
            </select>
            {errors.statusProduct && (
              <p className="text-red-500 text-sm mt-1">* Status is required</p>
            )}
          </div>
        </div>

        {/* <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="john.doe@company.com"
            required
          />
        </div> */}
     
       
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </Layout>
  );
}
