"use client";
import React from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export default function Header({
  role,
  setRole,
}: {
  role: string;
  setRole: (role: string) => void;
}) {
  const router = useRouter();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Admin",
      onClick: () => {
        setRole("Admin");
      },
    },
    {
      key: "2",
      label: "Principal",
      onClick: () => {
        setRole("Principal");
      },
    },
    {
      key: "3",
      label: "Teacher",
      onClick: () => {
        setRole("Teacher");
      },
    },
  ];

  const handleBackClick = () => {
    if (
      router.pathname === "/student/view" ||
      router.pathname === "/class/view"
    ) {
      router.push({ pathname: "/" });
    } else if (
      router.pathname === "/student/create" ||
      router.pathname === "/student/update" ||
      router.pathname === "/student/view/[id]"
    ) {
      router.push({ pathname: "/student/view", query: { role } });
    } else if (
      router.pathname === "/class/create" ||
      router.pathname === "/class/update" ||
      router.pathname === "/class/view/[id]"
    ) {
      router.push({ pathname: "/class/view", query: { role } });
    } else if (router.pathname === "/unauthorize") {
      router.push({ pathname: "/" });
    }
  };

  return (
    <div className="flex h-[50px] w-full items-end justify-center bg-blue-600">
      <div className="flex h-full w-[95%] items-center justify-between">
        {router.pathname !== "/" && (
          <button
            onClick={handleBackClick}
            className="flex h-full w-1/12 items-center justify-center"
          >
            {" "}
            <ArrowLeftOutlined />
          </button>
        )}
        {router.pathname === "/" && (
          <div className="ml-auto flex items-center">
            <p className="mr-2 font-bold">Access as:</p>
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {role}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
}
