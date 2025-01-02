import { GetStaticPaths, GetStaticProps } from "next";
import InformationLine from "@/components/informationLine";
import { Table, Space } from "antd";
import Button from "@/components/button";
import { useRouter } from "next/router";
import { useState } from "react";
import useStudentStore from "@/store/studentStore.ts";

interface Class {
  id: number;
  className: string;
}

interface Student {
  id: number;
  studentName: string;
  classId: string;
  class: object;
}

interface Props {
  classObj: Class;
  students: Student[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const classes = await fetch("http://localhost:8000/class").then((res) =>
    res.json(),
  );

  console.log("Classes:", classes);

  const paths = classes.map((classObj: Class) => ({
    params: { id: String(classObj.id) },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { id } = context.params as { id: string };

  if (!id) {
    return {
      notFound: true,
    };
  }
  const classObj = await fetch(`http://localhost:8000/class/id/${id}`).then(
    (res) => res.json(),
  );

  const students = await fetch(
    `http://localhost:8000/student/class/${classObj.className}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${"Admin"}`,
      },
    },
  ).then((res) => res.json());

  console.log(students);

  return {
    props: {
      classObj,
      students,
    },
    revalidate: 10,
  };
};

export default function Page({ classObj, students }: Props) {
  const router = useRouter();
  const role = router.query.role as string;
  const setStudent = useStudentStore((state) => state.setStudent);
  const [deleteModalShown, setDeleteModalShown] = useState(false);
  const [studentIndex, setStudentIndex] = useState(0);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "studentName",
      key: "name",
    },
    {
      title: "Class",
      dataIndex: ["class", "className"],
      key: "class",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Student) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setStudent(record);
              router.push({
                pathname: "/student/update",
                query: {
                  role,
                },
              });
            }}
            text="Update"
            styling="rounded-full bg-blue-600 px-5 py-2 font-bold text-white"
          />
          {(role === "Admin" || role === "Teacher") && (
            <Button
              onClick={() => {
                setStudentIndex(record.id);
                setDeleteModalShown(true);
              }}
              text="Delete"
              styling="rounded-full bg-red-600 px-5 py-2 font-bold text-white"
            />
          )}
          <Button
            onClick={() => {
              router.push({ pathname: `/student/view/${record.id}` });
            }}
            text="Detail"
            styling="rounded-full bg-green-600 px-5 py-2 font-bold text-white"
          />
        </Space>
      ),
    },
  ];
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center text-black">
      <div className="flex h-[80%] w-[90%] flex-col">
        <p className="mb-2 text-2xl font-bold">Basic info</p>
        <InformationLine title="Class ID" context={classObj.id.toString()} />
        <InformationLine title="Class name" context={classObj.className} />
        <div className="my-5 w-full border-[1px] border-gray-300" />
        <p className="mb-2 text-2xl font-bold">Students info</p>
        <Table className="w-full" dataSource={students} columns={columns} />
      </div>
      {deleteModalShown && (
        <div
          onClick={() => setDeleteModalShown(false)}
          className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
        >
          <div className="rounded-lg bg-white p-6">
            {(role === "Admin" || role === "Teacher") && (
              <>
                <p className="text-2xl font-bold text-red-500">
                  Are you sure to delete student with ID {studentIndex}?
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
                            `http://localhost:8000/student/${studentIndex}`,
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
            )}
          </div>
        </div>
      )}
    </main>
  );
}
