import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const UserPage = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState({ username: "", links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/links/${username}`,
        );
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching links");
        setLoading(false);
      }
    };

    fetchLinks();
  }, [username]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-6xl mb-4">🔗</div>
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white/40 text-lg"
        >
          {error}
        </motion.p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 text-white flex flex-col items-center">
      <div className="w-full max-w-[420px] px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
            {userData.username?.[0]?.toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-white">
            @{userData.username}
          </h1>
        </motion.div>

        {userData.links.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/40 text-sm"
          >
            No links yet — check back soon!
          </motion.p>
        ) : (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {userData.links.map((link, index) => (
              <motion.li
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium text-white">{link.title}</span>
                  </motion.div>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default UserPage;
