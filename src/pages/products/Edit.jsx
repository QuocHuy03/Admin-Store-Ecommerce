import React, { useEffect, useState } from "react";
import Layout from "../../libs/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { Form, message } from "antd";
import { List, Select, Upload } from "antd";
import { Button, Input, InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  fetchProductBySlug,
  fetchUpdateProduct,
} from "../../utils/api/productsApi";
import { fetchAllCategories } from "../../utils/api/categoriesApi";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getBase64, httpApi } from "../../dev";
import axios from "axios";

export default function Edit() {
  const size = "large";
  const navigate = useNavigate();
  const { slug } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageRequired, setIsImageRequired] = useState(true);
  const [descriptionData, setDescriptionData] = useState("");
  const [contentData, setContentData] = useState("");
  const [fileList, setFileList] = useState([]);
  const [isSlug, setIsSlug] = useState(slug || "");
  const [isImageUpdateAllowed, setIsImageUpdateAllowed] = useState(false);

  const [form] = Form.useForm();
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
    }
  );

  useEffect(() => {
    if (dataProduct) {
      setDescriptionData(dataProduct.descriptionProduct);
      setContentData(dataProduct.contentProduct);
    }
  }, [dataProduct]);

  useEffect(() => {
    if (dataProduct?.imagePaths) {
      const imagePaths = dataProduct.imagePaths.split(",");
      const fileListData = imagePaths.map((path, index) => ({
        url: path,
      }));
      setIsImageRequired(fileListData.length === 0);
      setFileList(fileListData);
    }
    setIsImageUpdateAllowed(true);
  }, [dataProduct]);

  const nameColors = dataProduct?.nameColors.split(",");

  const dataColors = [
    {
      id: 1,
      name: "black",
    },
    {
      id: 2,
      name: "red",
    },
    {
      id: 3,
      name: "yellow",
    },
  ];

  const options = dataColors.map((color) => ({
    value: color.name,
    label: color.name,
    checked: nameColors
      ?.map((nameColor) => nameColor.toLowerCase())
      .includes(color.name),
  }));

  const selectedOptions = options
    .filter((option) => option.checked)
    .map((option) => option.value);

  form.setFieldsValue({
    nameProduct: dataProduct?.nameProduct,
    price_has_ropped: dataProduct?.price_has_ropped,
    initial_price: dataProduct?.initial_price,
    nameColors: selectedOptions,
    statusProduct: dataProduct?.statusProduct,
    categoryID: dataProduct?.categoryID,
    contentProduct: contentData,
    descriptionProduct: contentData,
    imageProducts: fileList,
  });

  const onDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setDescriptionData(data);
  };
  const onContentChange = (event, editor) => {
    const data = editor.getData();
    setContentData(data);
  };

  const handleImageChange = async (info) => {
    let fileList = [...info.fileList];

    fileList = await Promise.all(
      fileList.map(async (file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        return file;
      })
    );

    setIsImageRequired(false);
    setIsImageUpdateAllowed(false);
    setFileList(fileList);
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    setIsImageRequired(newFileList.length === 0);
  };

  const updateProductMutation = useMutation((data) =>
    fetchUpdateProduct(isSlug, isImageUpdateAllowed, data)
  );

  const onFinish = async (values) => {
    setIsSubmitting(true);
    values.descriptionProduct = descriptionData;
    values.contentProduct = contentData;
    values.imageProducts = fileList;
    if (isImageUpdateAllowed) {
      try {
        console.log("Không Update Ảnh");
        const response = await updateProductMutation.mutateAsync(values);
        if (response.status === true) {
          message.success(`${response.message}`);
          navigate("/products");
        } else {
          message.error(`${response.message}`);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        console.log("Có Update Ảnh");
        const formData = new FormData();
        const imageFiles = values.imageProducts;

        imageFiles.forEach((file, index) => {
          formData.append(`file[]`, file.originFileObj);
        });

        const uploadResponse = await axios.post(
          `${httpApi}/api/uploadFile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // console.log(uploadResponse.data);

        const imageUrls = uploadResponse.data.secure_urls.map((file) => file);
        values.imageProducts = imageUrls;

        // Add mode
        const response = await updateProductMutation.mutateAsync(values);
        if (response.status === true) {
          message.success(`${response.message}`);
          navigate("/products");
        } else {
          message.error(`${response.message}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
    queryClient.invalidateQueries("edit-product");
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
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          {loadingProduct ? (
            <Loading />
          ) : (
            <>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <Form.Item
                  label="Name Product"
                  name="nameProduct"
                  style={{
                    marginBottom: 0,
                  }}
                  rules={[
                    { required: true, message: "* Name Product is required" },
                  ]}
                >
                  <Input size={size} placeholder="Asus GB5 ..." />
                </Form.Item>

                <Form.Item
                  label="Price Has Ropped"
                  name="price_has_ropped"
                  style={{
                    marginBottom: 0,
                  }}
                  rules={[
                    {
                      required: true,
                      message: "* Price Has ropped is required",
                    },
                  ]}
                >
                  <Input size={size} placeholder="10000" />
                </Form.Item>

                <Form.Item
                  label="Initial Price"
                  name="initial_price"
                  style={{
                    marginBottom: 0,
                  }}
                  rules={[
                    { required: true, message: "* Initial Price is required" },
                  ]}
                >
                  <Input size={size} placeholder="10000" />
                </Form.Item>

                <Form.Item
                  label="Categories"
                  name="categoryID"
                  style={{
                    marginBottom: 0,
                  }}
                  rules={[
                    { required: true, message: "* Categories is required" },
                  ]}
                >
                  <Select size={size}>
                    <Select.Option value="">
                      Vui Lòng Chọn Danh Mục
                    </Select.Option>
                    {dataCategory?.map((item, index) => (
                      <Select.Option key={index} value={item.id}>
                        {item.nameCategory}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Colors"
                  name="nameColors"
                  style={{
                    marginBottom: 0,
                  }}
                  rules={[{ required: true, message: "* Colors is required" }]}
                >
                  <Select
                    mode="tags"
                    size={size}
                    placeholder="Tags Color"
                    options={options}
                  />
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="statusProduct"
                  style={{
                    marginBottom: 0,
                  }}
                  rules={[{ required: true, message: "* Status is required" }]}
                >
                  <Select size={size}>
                    <Select.Option value="">
                      Vui Lòng Chọn Trạng Thái
                    </Select.Option>
                    <Select.Option value="stocking">Còn Hàng</Select.Option>
                    <Select.Option value="out-of-stock">Hết Hàng</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="mb-6">
                <Form.Item
                  label={`Images`}
                  name="imageProducts"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  <Upload
                    listType="picture"
                    fileList={fileList}
                    onChange={handleImageChange}
                    onRemove={handleRemove}
                    accept=".jpg,.png"
                    multiple
                  >
                    {fileList.length >= 8 ? null : (
                      <Button size={size}>Upload</Button>
                    )}
                  </Upload>
                  <List
                    className="mt-3"
                    grid={{ gutter: 8, column: 4 }}
                    dataSource={fileList}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleRemove(item)}
                          />,
                        ]}
                      >
                        <img src={item.url || item.preview} alt="" />
                      </List.Item>
                    )}
                  />
                  {isImageRequired && (
                    <div className="text-red-500">* Images is required</div>
                  )}
                </Form.Item>
              </div>

              <div className="mb-6">
                <Form.Item
                  label="Content"
                  name="contentProduct"
                  rules={[
                    {
                      required: true,
                      message: "* Content is required",
                    },
                  ]}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    data={contentData}
                    initialData={dataProduct?.contentProduct}
                    onReady={(editor) => {
                      editor.editing.view.change((writer) => {
                        writer.setStyle(
                          "height",
                          "200px",
                          editor.editing.view.document.getRoot()
                        );
                      });
                    }}
                    onChange={onContentChange}
                  />
                </Form.Item>
              </div>

              <div className="mb-6">
                <Form.Item
                  label="Description"
                  name="descriptionProduct"
                  rules={[
                    {
                      required: true,
                      message: "* Description is required",
                    },
                  ]}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    data={descriptionData}
                    initialData={dataProduct?.descriptionProduct}
                    onReady={(editor) => {
                      editor.editing.view.change((writer) => {
                        writer.setStyle(
                          "height",
                          "200px",
                          editor.editing.view.document.getRoot()
                        );
                      });
                    }}
                    onChange={onDescriptionChange}
                  />
                </Form.Item>
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
        </Form>
      </div>
    </Layout>
  );
}
