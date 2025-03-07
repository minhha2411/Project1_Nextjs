"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TableProps, Tag, Space, Table } from "antd";
import React, { useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { useAppDispatch } from "../lib/store";
import { setUsers } from "../lib/features/users/userSlice";

interface DataType {
  key: string;
  email: string;
  name?: string;
  age?: number;
  address?: string;
  tags?: string[];
}

function User() {
  const dispatch = useAppDispatch();
  // Access the client
  const queryClient = useQueryClient();

  const getUser = async () => {
    const users = await axiosInstance.get("/user");
    return users;
  };

  // Queries
  const { isError, data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  useEffect(() => {
    if (data?.data) {
      console.log(data?.data, "data?.data");
      dispatch(setUsers(data?.data));
    }
  }, [data, dispatch]);

  console.log(data, "userList");

  // Mutations
  //   const mutation = useMutation({
  //     mutationFn: postTodo,
  //     onSuccess: () => {
  //       // Invalidate and refetch
  //       queryClient.invalidateQueries({ queryKey: ['todos'] })
  //     },
  //   })

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags?.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const dataTable: DataType[] = data?.data?.map(
    ({ name = "", age = 20, email = "", address = "", tags = [] }, index) => ({
      key: index,
      name,
      age,
      email,
      address,
      tags,
    })
  );

  return (
    <div className="">
      <Table<DataType> columns={columns} dataSource={dataTable} />
    </div>
  );
}

export default User;
