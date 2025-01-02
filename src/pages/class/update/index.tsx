"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/button";
import useClassStore from "@/store/classStore.ts";
import Unauthorize from "@/pages/unauthorize";

export default function Page() {
  const router = useRouter();
  const { role } = router.query;

  const classObj = useClassStore((state) => state.classObj);
  const [className, setClassName] = useState<string>(classObj?.className || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClassName(event.target.value);
  };

  const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const res = await fetch("http://localhost:8000/class", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${role}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: classObj?.id,
        className: className,
      }),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      console.error("Error response:", errorResponse);
      alert(
        errorResponse.devMessage ||
          "Failed to update class. Please try again.",
      );
      setClassName(classObj?.className || "");
      return;
    }

    alert("Class updated successfully");
    await router.push({ pathname: "/class/view", query: { role } });
  };

  return (
    <>
      {role === "Admin" || role === "Principal" ? (
        <div className="flex h-[60vh] flex-col items-center justify-around text-black">
          <h1 className="text-4xl font-bold">Update Class</h1>
          <input
            type="text"
            value={className}
            placeholder="Class Name"
            onChange={handleInputChange}
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
