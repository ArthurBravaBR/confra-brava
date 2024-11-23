"use client";

import { useLogout, useMenu } from "@refinedev/core";
import Link from "next/link";
import Logo from "../../assets/logo-brava.png";
import Image from "next/image";
import { FaPowerOff } from "react-icons/fa";
import { useState } from "react";

export const Menu = () => {
  const { mutate: logout } = useLogout();
  const { menuItems, selectedKey } = useMenu();
  return (
    <nav className="menu flex flex-col items-center w-1/12 bg-gray-100">
      <Image src={Logo} alt="Logo Brava" className="w-[100px] mb-4" />
      <ul className="flex-1 list-none flex flex-col gap-2 w-full">
        {menuItems.map((item) => (
          <li key={item.key} className="w-full">
            <Link
              href={item.route ?? "/"}
              className={`flex items-center justify-center w-full p-3 ${
                selectedKey === item.key
                  ? "bg-babyBlue text-white "
                  : "bg-white text-black"
              } no-underline`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={() => logout()}
        className=" text-black py-2 px-4 mb-3 border-none flex gap-1 items-center justify-center bg-red-300 rounded-full"
      >
        <FaPowerOff />
        Logout
      </button>
    </nav>
  );
};
