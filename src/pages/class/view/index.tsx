import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Table, Space } from "antd";
import Button from "@/components/button";
import { useRouter } from "next/router";
import { useState } from "react";
import useClassStore from "@/store/classStore.ts";

type Class = {
  id: number;
  className: string;
};

export const getServerSideProps = (async (context) => {
  const { role } = context.query;
  const res = await fetch("http://localhost:8000/class", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${role}`,
    },
  });
  const classes: Class[] = await res.json();
  return { props: { classes, role } };
}) satisfies GetServerSideProps<{ classes: Class[] }>;

export default function ViewPage({
  classes,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const setClass = useClassStore((state) => state.setClass);
  const [deleteModalShown, setDeleteModalShown] = useState(false);
  const [classIndex, setClassIndex] = useState(0);
  const [classList, setClassList] = useState<Class[] | undefined>(classes);
  const [searchClass, setSearchClass] = useState("");
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Class Name",
      dataIndex: "className",
      key: "class",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Class) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setClass(record);
              router.push({
                pathname: "/class/update",
                query: {
                  role,
                },
              });
            }}
            text="Update"
            styling="rounded-full bg-blue-600 px-5 py-2 font-bold text-white"
          />
          <Button
            onClick={() => {
              setClassIndex(record.id);
              setDeleteModalShown(true);
            }}
            text="Delete"
            styling="rounded-full bg-red-600 px-5 py-2 font-bold text-white"
          />
          <Button
            onClick={() => {
              router.push({
                pathname: `/class/view/${record.id}`,
                query: { role },
              });
            }}
            text="Detail"
            styling="rounded-full bg-green-600 px-5 py-2 font-bold text-white"
          />
        </Space>
      ),
    },
  ];
  return (
    <div className="flex h-screen flex-col items-center text-black">
      <div className="mt-2 flex">
        <p>Find by class name:</p>
        <input
          value={searchClass}
          onChange={(event) => {
            setSearchClass(event.target.value);
            setClassList(
              classes.filter((classObj) =>
                classObj.className
                  .toLowerCase()
                  .includes(event.target.value.toLowerCase()),
              ),
            );
          }}
        />
      </div>
      <Table className="w-[90%] mt-2" dataSource={classList} columns={columns} />
      <Button
        onClick={() => {
          router.push({ pathname: "/class/create", query: { role } });
        }}
        text="Create class"
        styling="w-[12%] rounded-md bg-blue-600 px-5 py-2 font-bold text-white mt-5"
      />
      {deleteModalShown && (
        <div
          onClick={() => setDeleteModalShown(false)}
          className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
        >
          <div className="rounded-lg bg-white p-6">
            {role === "Admin" || role === "Principal" ? (
              <>
                <p className="text-2xl font-bold text-red-500">
                  Are you sure to delete class with ID {classIndex}?
                </p>
                <div className="mt-4 flex justify-end">
                  <div className="flex w-[40%] justify-between">
                    <Button
                      onClick={() => setDeleteModalShown(false)}
                      text="No"
                      styling="rounded-full bg-red-600 px-5 py-2 font-bold text-white"
                    />
                    <Button
                      onClick={async () => {
                        try {
                          await fetch(
                            `http://localhost:8000/class/${classIndex}`,
                            {
                              method: "DELETE",
                              headers: {
                                Authorization: `Bearer ${role}`,
                              },
                            },
                          );
                          setDeleteModalShown(false);
                          router.reload();
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                      text="Yes"
                      styling="rounded-full bg-green-600 px-5 py-2 font-bold text-white"
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-2xl font-bold text-red-500">
                You don&apos;t have permission to delete class
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
