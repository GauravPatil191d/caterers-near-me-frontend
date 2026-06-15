"use client";

import Link from "next/link";
import "./style.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Caterers Near Me</div>

      <div className="navbar-links">
        <Link href="/">Home</Link>
      </div>
    </nav>
  );
}
