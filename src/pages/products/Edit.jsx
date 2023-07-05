import React, { useEffect, useState } from "react";
import Layout from "../../libs/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { message } from "antd";
import {
  fetchProductBySlug,
  fetchUpdateProduct,
} from "../../utils/api/productsApi";
import { fetchAllCategories } from "../../utils/api/categoriesApi";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function Edit() {
  const { slug } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false); // set loading button
  const [isSlug, setIsSlug] = useState(slug || "");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (slug) {
      setIsSlug(slug);
    }
  }, [slug]);

  const { data: dataCategory, isLoading: loadingCategory } = useQuery(
    ["categories"],
    () => fetchAllCategories(),
    {
      staleTime: 1000,
      refetchOnMount: false,
    }
  );

  const { data: dataProduct, isLoading: loadingProduct } = useQuery(
    ["edit-product", isSlug],
    () => fetchProductBySlug(isSlug),
    {
      staleTime: 500,
      enabled: Boolean(isSlug),
    }
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const updateProductMutation = useMutation((data) =>
    fetchUpdateProduct(isSlug, data)
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Add mode
      const response = await updateProductMutation.mutateAsync(data);
      if (response.status === true) {
        message.success(`${response.message}`);
      } else {
        message.error(`${response.message}`);
      }
      queryClient.invalidateQueries("edit-product");
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between px-6">
        <Link
          to="/products"
          className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          List Products
        </Link>
      </div>
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {loadingProduct && loadingCategory ? (
            <Loading />
          ) : (
            <>
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
                    defaultValue={dataProduct.nameProduct}
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
                      errors.price_has_ropped
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    {...register("price_has_ropped", { required: true })}
                    defaultValue={dataProduct.price_has_ropped}
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
                    defaultValue={dataProduct.categoryID}
                    className={`${
                      errors.categoryID ? "border-red-500" : "border-gray-300"
                    } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    {...register("categoryID", { required: true })}
                  >
                    <option value="">Vui Lòng Chọn Trạng Thái</option>
                    {dataCategory?.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.nameCategory}
                      </option>
                    ))}
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
                      errors.initial_price
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    {...register("initial_price", { required: true })}
                    defaultValue={dataProduct.initial_price}
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
                    htmlFor="statusProduct"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Status
                  </label>

                  <select
                    id="statusProduct"
                    className={`${
                      errors.statusProduct
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    {...register("statusProduct", { required: true })}
                    defaultValue={dataProduct.statusProduct}
                  >
                    <option value="">Vui Lòng Chọn Trạng Thái</option>
                    <option value="stocking">Còn Hàng</option>
                    <option value="out-of-stock">Hết Hàng</option>
                  </select>

                  {errors.statusProduct && (
                    <p className="text-red-500 text-sm mt-1">
                      * Status is required
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
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
                  value={dataProduct.contentProduct}
                >
                  {dataProduct.contentProduct}
                </textarea>

                {errors.contentProduct && (
                  <p className="text-red-500 text-sm mt-1">
                    * Content Product is required
                  </p>
                )}
              </div>

              <div className="mb-6">
                <Controller
                  control={control}
                  name="descriptionProduct"
                  rules={{ required: true }}
                  defaultValue={dataProduct.descriptionProduct} // Gán giá trị mặc định từ dữ liệu cũ
                  render={({ field }) => (
                    <CKEditor
                      editor={ClassicEditor}
                      data={field.value} // Sử dụng giá trị từ field.value
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        field.onChange(data);
                      }}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "200px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                      }}
                    />
                  )}
                />
                {errors.descriptionProduct && (
                  <p className="text-red-500 text-sm mt-1">
                    * Description is required
                  </p>
                )}
              </div>

              <div className="pb-10">
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
                    Update
                  </button>
                ) : (
                  <button
                    type="submit"
                    className=" text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    Save
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </Layout>
  );
}
