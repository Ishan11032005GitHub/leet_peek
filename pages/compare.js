import { useState } from "react";
import Head from "next/head";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_BASE = "https://leetcode-stats.tashif.codes";

export default function ComparePage() {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [stats1, setStats1] = useState(null);
  const [stats2, setStats2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const compareUsers = async (e) => {
    e.preventDefault();
    if (!user1.trim() || !user2.trim()) return setError("Enter both usernames.");

    setLoading(true);
    setError("");
    try {
      const [d1, d2] = await Promise.all([
        fetch(`${API_BASE}/${user1}`).then(r => r.json()),
        fetch(`${API_BASE}/${user2}`).then(r => r.json())
      ]);

      if (d1.status !== "success" || d2.status !== "success") throw new Error();

      setStats1(d1);
      setStats2(d2);
    } catch {
      setError("Invalid usernames or fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats1 && stats2 ? [
    { metric: "Easy", [user1]: stats1.easySolved, [user2]: stats2.easySolved },
    { metric: "Medium", [user1]: stats1.mediumSolved, [user2]: stats2.mediumSolved },
    { metric: "Hard", [user1]: stats1.hardSolved, [user2]: stats2.hardSolved },
  ] : [];

  return (
    <>
      <Head><title>Compare Users</title></Head>

      <main className="app-main">
        <section className="hero-card">
          <h1>Compare LeetCode Users</h1>

          <form className="compare-form" onSubmit={compareUsers}>
            <input placeholder="User 1" value={user1} onChange={e => setUser1(e.target.value)} />
            <input placeholder="User 2" value={user2} onChange={e => setUser2(e.target.value)} />
            <button disabled={loading}>{loading ? "Checking..." : "Compare"}</button>
          </form>

          {error && <p className="error-box">{error}</p>}
        </section>

        {stats1 && stats2 && (
          <section className="card full-width-card">
            <h2>Comparison</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="metric" /><YAxis /><Tooltip /><Legend />
                <Bar dataKey={user1} fill="#ff914d" radius={[6,6,0,0]} />
                <Bar dataKey={user2} fill="#4f9cff" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        )}
      </main>
    </>
  );
}
