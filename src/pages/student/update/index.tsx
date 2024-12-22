"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/button";
import useStudentStore from "@/store/studentStore.ts";
import Unauthorize from "@/pages/unauthorize";

export default function Page() {
  const router = useRouter();
  const { role } = router.query;

  const student = useStudentStore((state) => state.student);
  const [studentName, setStudentName] = useState<string>(
    student?.studentName || "",
  );
  const [className, setClassName] = useState<string>(student?.className || "");

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<string>>,
  ) => {
    setter(event.target.value);
  };

  const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const res = await fetch("http://localhost:8000/student", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${role}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: student?.id,
        studentName: studentName,
        className: className,
      }),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      console.error("Error response:", errorResponse);
      alert(
        errorResponse.devMessage ||
          "Failed to update student. Please try again.",
      );
      setStudentName(student?.studentName || "");
      setClassName(student?.className || "");
      return;
    }

    alert("Student updated successfully");
    await router.push({ pathname: "/student/view", query: { role } });
  };

  return (
    <>
      {role === "Admin" || role === "Teacher" ? (
        <div className="flex h-[60vh] flex-col items-center justify-around text-black">
          <h1 className="text-4xl font-bold">Update Student</h1>

          <input
            type="text"
            value={studentName}
            placeholder="Student Name"
            onChange={(event) => handleInputChange(event, setStudentName)}
            className="rounded-md border-2 border-gray-400 p-2"
          />
          <input
            type="text"
            value={className}
            placeholder="Class Name"
            onChange={(event) => handleInputChange(event, setClassName)}
            className="rounded-md border-2 border-gray-400 p-2"
          />
          <Button
            onClick={handleUpdate}
            text="Update"
            styling="rounded-full bg-blue-600 px-5 py-2 font-bold text-white"
          />
        </div>
      ) : (
        <div>
          <Unauthorize />
        </div>
      )}
    </>
  );
}
