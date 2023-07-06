import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { fetchAllUsers, fetchUpdateUser } from "../../utils/api/userApi";
import Layout from "../../libs/Layout";
import DataTable from "react-data-table-component";
import { AppContext } from "../../context/AppContextProvider";
import { useForm } from "react-hook-form";
import ModalForm from "../../components/ModalForm";
import ModalMessage from "../../components/ModalMessage";
import { Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Loading from "../../components/Loading";

export default function List() {
  const { isOpenModal, setIsOpenModal } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false); // set loading button
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState(null);

  const { data, isLoading } = useQuery(["users"], () => fetchAllUsers(), {
    staleTime: 1000,
  });

  const huydev = [
    {
      name: "STT",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "USERNAME",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "FULLNAME",
      selector: (row) => row.fullname,
      sortable: true,
    },
    {
      name: "PHONE",
      selector: (row) => (row.phone ? row.phone : "Chưa Cập Nhật"),
      sortable: true,
    },
    {
      name: "ADDRESS",
      selector: (row) => (row.address ? row.address : "Chưa Cập Nhật"),
      sortable: true,
    },
    {
      name: "ROLE",
      selector: (row) => row?.role,
      sortable: true,
    },

    {
      name: "ACTIONS",
      cell: (row) => (
        <div>
          <button
            onClick={() => editModal(row)}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // search data

  const filteredData = searchText
    ? data.filter((huyit) =>
        huyit.username.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  // modal form

  const editModal = (item) => {
    setUserData(item);
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setUserData("");
    setIsOpenModal(false);
    reset();
  };

  const updateUserMutation = useMutation((data) =>
    fetchUpdateUser(userData.id, data)
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Edit mode
      const response = await updateUserMutation.mutateAsync(data);
      if (response.status === true) {
        message.success(`${response.message}`);
      } else {
        message.error(`${response.message}`);
      }

      reset();
      closeModal();
      queryClient.invalidateQueries("users");
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
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
          </div>
        </div>

        <ModalForm
          title={"Edit User"}
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
              Update
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>

                <select
                  id="role"
                  className={`${
                    errors.role ? "border-red-500" : "border-gray-300"
                  } bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  {...register("role", { required: true })}
                  defaultValue={userData?.role}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    * Role is required
                  </p>
                )}
              </div>
            </div>
          </form>
        </ModalForm>

        {isLoading ? (
          <Loading />
        ) : (
          <DataTable
            columns={huydev}
            data={filteredData}
            dense={false}
            responsive={true}
            pagination
          />
        )}
      </div>
    </Layout>
  );
}
