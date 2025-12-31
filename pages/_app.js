import "../styles/globals.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.className = saved;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <>
      {/* Global Navbar */}
      <nav className="nav-bar">
        <div className="nav-left">
          <div className="nav-title">LeetPeek</div>
          <div className="nav-links">
            <Link href="/">Dashboard</Link>
            <Link href="/compare">Compare Users</Link>
          </div>
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </nav>

      <Component {...pageProps} theme={theme} />
    </>
  );
}
