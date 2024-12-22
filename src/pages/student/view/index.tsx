import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Table, Space } from "antd";
import Button from "@/components/button";
import { useRouter } from "next/router";
import { useState } from "react";
import useStudentStore from "@/store/studentStore.ts";

type Student = {
  id: number;
  studentName: string;
  className: string;
};

export const getServerSideProps = (async (context) => {
  const { role } = context.query;
  const res = await fetch("http://localhost:8000/student", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${role}`,
    },
  });
  const students: Student[] = await res.json();
  console.log(students);
  return { props: { students, role } };
}) satisfies GetServerSideProps<{ students: Student[] }>;

export default function ViewPage({
  students,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const setStudent = useStudentStore((state) => state.setStudent);
  const [deleteModalShown, setDeleteModalShown] = useState(false);
  const [studentIndex, setStudentIndex] = useState(0);
  const [studentList, setStudentList] = useState<Student[] | undefined>(
    students,
  );
  const [searchName, setSearchName] = useState("");
  const [searchClass, setSearchClass] = useState("");
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
      dataIndex: "className",
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
          <Button
            onClick={() => {
              setStudentIndex(record.id);
              setDeleteModalShown(true);
            }}
            text="Delete"
            styling="rounded-full bg-red-600 px-5 py-2 font-bold text-white"
          />
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
    <div className="flex h-screen flex-col items-center text-black">
      <div className="flex mt-2">
        <p>Find by name: </p>
        <input
          value={searchName}
          onChange={(event) => {
            setSearchName(event.target.value);
            setStudentList(
              students.filter((student) =>
                student.studentName.toLowerCase().includes(event.target.value.toLowerCase()),
              ),
            );
          }}
        />
      </div>
      <div className="flex mt-2">
        <p>Find by class name:</p>
        <input
          value={searchClass}
          onChange={(event) => {
            setSearchClass(event.target.value);
            setStudentList(
              students.filter((student) =>
                student.className.toLowerCase().includes(event.target.value.toLowerCase()),
              ),
            );
          }}
        />
      </div>
      <Table className="w-[90%] mt-2" dataSource={studentList} columns={columns} />
      <Button
        onClick={() => {
          router.push({ pathname: "/student/create", query: { role } });
        }}
        text="Create student"
        styling="w-[15%] rounded-md bg-blue-600 px-5 py-2 font-bold text-white mt-5"
      />
      {deleteModalShown && (
        <div
          onClick={() => setDeleteModalShown(false)}
          className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
        >
          <div className="rounded-lg bg-white p-6">
            {role === "Admin" || role === "Teacher" ? (
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
            ) : (
              <p className="text-2xl font-bold text-red-500">
                You don&apos;t have permission to delete student
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
