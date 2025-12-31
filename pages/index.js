import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async (e) => {
    e.preventDefault();

    if (!username.trim()) return setError("Username cannot be empty.");

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      const result = await res.json();

      if (result.status === "error") throw new Error();

      setData(result);
    } catch {
      setError("Invalid Username or Network Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>LeetPeek Dashboard</title></Head>

      <main className="app-main">
        <section className="hero-card">
          <h1>LeetView</h1>

          <form onSubmit={fetchStats} className="search-form">
            <label>LeetCode Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g johndoe"
            />

            <button disabled={loading}>
              {loading ? "Fetching..." : "Fetch Stats"}
            </button>
          </form>

          {error && <p className="error-box">{error}</p>}
        </section>

        {loading && (
          <div className="card skeleton-card">
            <div className="loading-bar" /><div className="loading-bar" />
          </div>
        )}

        {data && (
          <section className="card">
            <h2>Stats</h2>
            <p>Total Solved: {data.totalSolved}</p>
            <p>Rank: {data.ranking?.toLocaleString()}</p>
            <p>Acceptance Rate: {data.acceptanceRate}%</p>
          </section>
        )}
      </main>
    </>
  );
}
