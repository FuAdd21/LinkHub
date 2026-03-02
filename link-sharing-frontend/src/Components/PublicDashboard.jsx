/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const PublicDashboard = () => {
  const { username } = useParams();
  const [userLinks, setUserLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/links/${username}`);
        setUserLinks(response.data.links || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading user dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, [username]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-gray-800 mb-8"
      >
        {username}'s Links 🔗
      </motion.h1>

      {userLinks.length === 0 ? (
        <p className="text-center text-gray-600">This user hasn’t added any links yet.</p>
      ) : (
        <ul className="max-w-xl mx-auto space-y-3">
          {userLinks.map((link) => (
            <motion.li
              key={link.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow rounded-lg p-4"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                {link.title}
              </a>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PublicDashboard;
