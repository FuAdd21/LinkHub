import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const UserPage = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState({ username: '', links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/links/${username}`);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching links');
        setLoading(false);
      }
    };

    fetchLinks();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-red-600 text-xl"
      >
        {error}
      </motion.p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-gray-800 mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        >
          {userData.username}'s Links
        </motion.h1>
        {userData.links.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 text-lg"
          >
            No links found for this user.
          </motion.p>
        ) : (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {userData.links.map((link, index) => (
              <motion.li
                key={link.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 hover:bg-gray-50 transition-colors duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="text-xl font-semibold text-gray-800 mb-2"
                  >
                    {link.title}
                  </motion.div>
                  <p className="text-blue-600 hover:underline">{link.url}</p>
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