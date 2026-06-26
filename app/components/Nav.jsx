"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import insta from "@/assets/insta.png";
import LinkedIn from "@/assets/linkedin.png";
import Hamburger from "./Hamburger";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="grid grid-flow-col grid-cols-2 md:grid-cols-4 fixed justify-center  px-6 py-3 border-b-[1px] border-[#f9672d3c] text-white w-[100vw] nav z-50">
      <div className="col-span-1">
        <Link href="/">
          <Image width={210} height={210} src="./nav_logo.svg" alt="logo" />
        </Link>
      </div>
      <ul className="hidden md:flex col-span-3 justify-self-end justify-center items-center lg:py-2  navList self-end">
        <li className="px-[12px] hover:text-[#fe8d32] rounded-xs" key={`home`}>
          <Link href="/">
            Home
            <div />
          </Link>
        </li>
        <li
          className="px-[12px] hover:text-[#fe8d32] rounded-xs"
          key={`events`}
        >
          <Link href="/event">
            Events
            <div />
          </Link>
        </li>
        <li
          className="px-[12px] hover:text-[#fe8d32] rounded-xs"
          key={`certificates`}
        >
          <Link href="/certificates">
            Certificates
            <div />
          </Link>
        </li>
        <li
          className="px-[12px] hover:text-[#fe8d32] rounded-xs"
          key={`newsletter`}
        >
          <Link href="/newsletter">
            Newsletter
            <div />
          </Link>
        </li>
        <li
          className="px-[12px] hover:text-[#fe8d32] rounded-xs"
          key={`leaderboard`}
        >
          <Link href="/leaderboard">
            Leaderboards
            <div />
          </Link>
        </li>
        {/* <li
          className="px-[12px] hover:text-[#fe8d32] rounded-xs"
          key={`problems`}
        >
          <Link href="/problems">
            Problems
            <div />
          </Link>
        </li> */}
        <li
          className="px-[12px] mr-3 hover:text-[#fe8d32] rounded-xs"
          key={`team`}
        >
          <a href="/team">
            Team
            <div />
          </a>
        </li>
        <div key={`insta`}>
          <a
            href="https://www.instagram.com/csc_muj/"
            target="_blank"
            rel="noreferrer"
          >
            <Image src={insta} height={24} width={24} alt="Instagram" />
          </a>
        </div>
        <div key={`LinkedIn`} className="pl-4">
          <a
            href="https://www.linkedin.com/company/cyber-space-club/posts/?feedView=all"
            target="_blank"
            rel="noreferrer"
          >
            <Image src={LinkedIn} height={30} width={30} alt="LinkedIn" />
          </a>
        </div>
        <div key={`X`} className="pl-4">
          <a
            href="https://x.com/cyberspacemuj"
            target="_blank"
            rel="noreferrer"
          >
            
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={22}
                height={22}
                fill="none"
                viewBox="0 0 1200 1227"
              >
                <path
                  fill="#fe8d32"
                  d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                />
              </svg>
          </a>
        </div>
      </ul>
      <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </nav>
  );
};

export default Navbar;
