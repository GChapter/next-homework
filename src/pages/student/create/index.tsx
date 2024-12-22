"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/button";
import Unauthorize from "@/pages/unauthorize";

export default function Page() {
  const router = useRouter();
  const { role } = router.query;

  const [studentName, setStudentName] = useState<string>("");
  const [className, setClassName] = useState<string>("");

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<string>>,
  ) => {
    setter(event.target.value);
  };

  const handleCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const res = await fetch("http://localhost:8000/student", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${role}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentName: studentName,
        className: className,
      }),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      console.error("Error response:", errorResponse);
      alert(
        errorResponse.devMessage ||
          "Failed to create student. Please try again.",
      );
      return;
    }

    alert("Student created successfully");
    await router.push({ pathname: "/student/view", query: { role } });
  };

  return (
    <>
      {role === "Admin" || role === "Teacher" ? (
        <div className="flex h-[60vh] flex-col items-center justify-around text-black">
          <h1 className="text-4xl font-bold">Create Student</h1>

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
            onClick={handleCreate}
            text="Create"
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
