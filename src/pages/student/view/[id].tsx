import { GetStaticPaths, GetStaticProps } from "next";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import InformationLine from "@/components/informationLine";

interface Student {
  id: number;
  studentName: string;
  className: string;
}

interface Props {
  student: Student;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const students = await fetch("http://localhost:8000/student", {
    headers: {
      Authorization: `Bearer ${"admin"}`,
    },
  }).then((res) => res.json());

  const paths = students.map((student: Student) => ({
    params: { id: String(student.id) },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { id } = context.params as { id: string };

  if (!id) {
    return {
      notFound: true,
    };
  }
  const student = await fetch(`http://localhost:8000/student/id/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${"admin, principal, teacher"}`,
    },
  }).then((res) => res.json());

  return {
    props: {
      student,
    },
    revalidate: 10,
  };
};

export default function Page({ student }: Props) {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center text-black">
      <div className="flex h-[80%] w-fit">
        <Avatar size={100} icon={<UserOutlined />} />
        <div className="mx-5 h-full border-[1px] border-gray-300" />
        <div>
          <p className="mb-2 text-2xl font-bold">Basic info</p>
          <InformationLine title="Student ID" context={student.id.toString()} />
          <InformationLine title="Student name" context={student.studentName} />
          <InformationLine title="Class name" context={student.className} />
          <div className="my-5 w-full border-[1px] border-gray-300" />
          <p className="mb-2 text-2xl font-bold">Family info</p>
        </div>
      </div>
    </main>
  );
}
