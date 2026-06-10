import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repos, setRepos] = useState([]);

  const searchUser = async () => {
    if (!username.trim()) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);

      if (!response.ok) {
        throw new Error("User Not Found");
      }

      const data = await response.json();
      setUser(data);

      const repoResponse = await fetch(
        `https://api.github.com/users/${username}/repos`,
      );

      const repoData = await repoResponse.json();

      setRepos(repoData);
    } catch (error) {
      setError(error.message);
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-8 flex flex-col items-center">
      <h1
        className="text-4xl md:text-5xl font-bold mb-8 text-center 
               bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 
               bg-clip-text text-transparent"
      >
        GitHub Profile Finder
      </h1>

      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Enter GitHub Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchUser()}
          className="p-4 w-72 rounded-lg bg-[#161b22] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />

        <button
          onClick={searchUser}
          className="px-9 py-4 bg-green-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-green-700 active:bg-green-800 active:scale-95 focus:outline-none focus:ring-1 focus:ring-green-300 transition-all duration-200 shadow-md"
        >
          Search
        </button>
      </div>

      {loading && (
        <h3 className="text-gray-300 font-medium animate-pulse mt-4">
          Loading...
        </h3>
      )}

      {error && (
        <p className="text-red-500 font-semibold mt-4 bg-red-900/20 px-4 py-2 rounded-lg border border-red-500/30">
          {error}
        </p>
      )}

      {user && (
        <div className="bg-[#161b22] p-8 rounded-xl w-[400px] text-center mb-8 shadow-lg">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-36 h-36 rounded-full mx-auto mb-4 border-4 border-red-700"
          />

          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>

          <p className="text-gray-400 mb-3">@{user.login}</p>

          <p className="text-gray-300 mb-6">{user.bio}</p>

          <div className="flex justify-around mb-6">
            <div>
              <h3 className="text-xl font-bold text-blue-400">
                {user.followers}
              </h3>
              <p className="text-gray-400 text-sm">Followers</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-400">
                {user.following}
              </h3>
              <p className="text-gray-400 text-sm">Following</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-400">
                {user.public_repos}
              </h3>
              <p className="text-gray-400 text-sm">Repos</p>
            </div>
          </div>

          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
          >
            Visit GitHub Profile
          </a>
        </div>
      )}

      {repos.length > 0 && (
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8">Repositories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-[#161b22] p-6 rounded-xl border border-[#30363d] shadow-lg hover:border-[#58a6ff] transition-all duration-200"
              >
                <h3 className="text-xl font-semibold text-[#58a6ff] mb-3">
                  {repo.name}
                </h3>

                <p className="text-gray-300 mb-4 min-h-[48px]">
                  {repo.description || "No description available"}
                </p>

                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[#58a6ff] font-medium hover:text-blue-400"
                >
                  View Repository
                  <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
