import React, { useState, useContext, useEffect } from "react";
import Layout from "../../libs/Layout";
import { AppContext } from "../../context/AppContextProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ModalForm from "../../components/ModalForm";
import { useForm } from "react-hook-form";
import { Empty, Button, Upload, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import {
  fetchAllCategories,
  fetchDeleteCategoriesByIds,
  fetchDeleteCategory,
  fetchPostCategory,
  fetchUpdateCategory,
} from "../../utils/api/categoriesApi";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";
import ModalMessage from "../../components/ModalMessage";
import { getBase64, httpApi } from "../../dev";
import axios from "axios";

export default function Lists() {
  const { isOpenModal, setIsOpenModal } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false); // set loading button
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [dataIdToDelete, setDataIdToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [fileList, setFileList] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageRequired, setIsImageRequired] = useState(true);
  const [categoryData, setCategoryData] = useState(null);
  const [isImageUpdateAllowed, setIsImageUpdateAllowed] = useState(false);

  const huydev = [
    {
      name: "STT",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "IMAGE",
      cell: (row) => (
        <img
          src={row.imageCategory}
          alt="Product Image"
          style={{ height: "50px" }}
        />
      ),
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
      name: "ACTION",
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

  // modal message

  const showModal = (item) => {
    if (item !== null && item !== undefined) {
      setDataIdToDelete(item.id);
      setCategoryName(item.nameCategory);
    } else {
      console.log("Đã Đúng Select");
    }
    setIsModalDelete(true);
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
    setCategoryName("");
    setDataIdToDelete("");
  };

  const handleCancel = () => {
    setIsModalDelete(false);
    setDataIdToDelete(null);
    setCategoryName(null);
  };

  const deleteCategoryMutation = useMutation((id) => fetchDeleteCategory(id), {
    onSuccess: (response) => {
      console.log(response);
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

  // delete checker

  const handleRowSelected = (rows) => {
    const selectedIds = rows.selectedRows.map((row) => row.id);
    setSelectedRows(selectedIds);
  };

  const handleDeleteSelectedMutation = useMutation(
    (id) => fetchDeleteCategoriesByIds(id),
    {
      onSuccess: (response) => {
        if (response.status === true) {
          message.success(`${response.message}`);
          setSelectedRows("");
          setCategoryName("");
          setDataIdToDelete("");
        } else {
          message.error(`${response.message}`);
        }
        queryClient.invalidateQueries(["categories"]);
      },
      onError: (error) => {
        console.error(error);
        message.error(`${error}`);
      },
    }
  );

  const { data, isLoading } = useQuery(
    ["categories"],
    () => fetchAllCategories(),
    {
      staleTime: 1000,
      refetchOnMount: false,
    }
  );

  // search data

  const filteredData = searchText
    ? data.filter((huyit) =>
        huyit.nameCategory.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;
  // modal form

  const openModal = () => {
    setIsEditing(false);
    setIsOpenModal(true);
    setFileList();
  };

  const editModal = (id, item) => {
    setCategoryData(item);
    setFileList({ url: item.imageCategory });
    setIsEditing(true);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setIsOpenModal(false);
    reset();
  };

  // form add

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (categoryData?.imageCategory) {
      setFileList({ url: categoryData.imageCategory });
      setIsImageRequired(false);
    }
    setIsImageUpdateAllowed(true);
  }, [categoryData]);

  useEffect(() => {
    if (isEditing) {
      setValue("nameCategory", categoryData.nameCategory);
      setValue("statusCategory", categoryData.statusCategory);
      setValue("outstandingCategory", categoryData.outstandingCategory);
      setValue("imageCategory", categoryData.imageCategory);
    } else {
      setValue("nameCategory", "");
      setValue("statusCategory", "");
      setValue("outstandingCategory", "");
      setValue("imageCategory", "");
    }
  }, [isEditing, categoryData, setValue]);

  const updateCategoryMutation = useMutation((data) =>
    fetchUpdateCategory(categoryData.slugCategory, isImageUpdateAllowed, data)
  );

  const postCategoryMutation = useMutation((data) => fetchPostCategory(data));
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    data.imageCategory = fileList;

    try {
      if (!isImageUpdateAllowed) {
        // console.log("upload ảnh mới");
        if (isEditing) {
          const formData = new FormData();
          formData.append("file", data.imageCategory.originFileObj);
          const uploadResponse = await axios.post(
            `${httpApi}/api/uploadFile/one`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const imageUrl = uploadResponse.data.secure_url;
          data.imageCategory = imageUrl;
          // Edit mode
          const response = await updateCategoryMutation.mutateAsync(data);
          if (response.status === true) {
            message.success(`${response.message}`);
          } else {
            message.error(`${response.message}`);
          }
        } else {
          // Add mode
          const response = await postCategoryMutation.mutateAsync(data);
          if (response.status === true) {
            message.success(`${response.message}`);
          } else {
            message.error(`${response.message}`);
          }
        }
      } else {
        // console.log("ko upload ảnh mới");
        if (isEditing) {
          // Edit mode
          const response = await updateCategoryMutation.mutateAsync(data);
          if (response.status === true) {
            message.success(`${response.message}`);
          } else {
            message.error(`${response.message}`);
          }
        } else {
          // Add mode
          const formData = new FormData();
          formData.append("file", data.imageCategory.originFileObj);
          const uploadResponse = await axios.post(
            `${httpApi}/api/uploadFile/one`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const imageUrl = uploadResponse.data.secure_url;
          data.imageCategory = imageUrl;
          const response = await postCategoryMutation.mutateAsync(data);
          if (response.status === true) {
            message.success(`${response.message}`);
          } else {
            message.error(`${response.message}`);
          }
        }
      }

      // Add , Update

      reset();
      closeModal();
      queryClient.invalidateQueries("categories");
    } catch (error) {
      console.error(error);
    }

    setIsSubmitting(false);
  };

  const handleImageChange = async (info) => {
    let selectedFile = info.file;

    if (selectedFile.response) {
      selectedFile.url = selectedFile.response.url;
    }
    if (!selectedFile.url && !selectedFile.preview) {
      selectedFile.preview = await getBase64(selectedFile.originFileObj);
    }
    if (isEditing) {
      setIsImageUpdateAllowed(false);
    }
    setIsImageRequired(false);
    setFileList(selectedFile);
  };

  const handleRemove = () => {
    setFileList();
    setIsImageRequired(true);
  };
  return (
    <Layout>
      <div className="relative overflow-x-auto">
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
          <button
            onClick={openModal}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ml-2"
          >
            Add
          </button>
        </div>

        <ModalForm
          title={isEditing ? "Edit Category" : "Add Category"}
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
              {isEditing ? "Update" : "Add"}
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
                >
                  <option value="">Vui Lòng Chọn Trạng Thái</option>
                  <option value="stocking">Còn Hàng</option>
                  <option value="out-of-stock">Hết Hàng</option>
                </select>
                {errors.statusCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    * Status is required
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2">
              <label
                htmlFor="outstandingCategory"
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

            <div className="mt-2">
              <label
                htmlFor="upload"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Upload Image
              </label>
              <div
                label={`Images`}
                name="imageCategory"
                style={{
                  marginBottom: 0,
                }}
              >
                <Upload
                  listType="picture"
                  name="imageCategory"
                  onChange={handleImageChange}
                  onRemove={handleRemove}
                  accept=".jpg,.png"
                  multiple={false} // Chỉ cho phép tải lên 1 ảnh
                  showUploadList={false}
                >
                  {fileList ? (
                    <img
                      className="mt-4"
                      width={100}
                      src={fileList.url || fileList.preview}
                      alt=""
                    />
                  ) : (
                    <Empty
                      className="text-center"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </Upload>
                {fileList ? (
                  <Button
                    className="mt-2"
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleRemove()}
                  />
                ) : null}
                {isImageRequired && (
                  <div className="text-red-500">* Images is required</div>
                )}
              </div>
            </div>
          </form>
        </ModalForm>

        <ModalMessage
          title="Delete Category"
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
          {categoryName ? "category" : "categories"} "
          {categoryName ? categoryName : selectedRows.length}" ?
        </ModalMessage>
        {isLoading ? (
          <div className="flex justify-center pt-2">
            <Loading />
          </div>
        ) : (
          <DataTable
            columns={huydev}
            data={filteredData}
            dense={false}
            responsive={true}
            pagination
            selectableRows
            onSelectedRowsChange={handleRowSelected}
          />
        )}
      </div>
    </Layout>
  );
}
