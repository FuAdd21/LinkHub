import { db } from "../config/db.js";

export const getFeaturedUsers = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id, c.name as username, c.email, c.avatar,
        l.id as link_id, l.title, l.url, l.platform, l.username as link_username, l.profileData
      FROM clients c
      LEFT JOIN links l ON c.id = l.user_id
      ORDER BY c.id DESC
      LIMIT 20
    `;

    const [results] = await db.query(query);

    if (!results || results.length === 0) {
      return res.json([]);
    }

   const featuredUsers = results.reduce((acc, row) => {
      const user = acc.find((u) => u.username === row.username);
      const linkData = row.link_id
        ? {
            id: row.link_id,
            title: row.title,
            url: row.url,
            platform: row.platform,
            username: row.link_username,
            profileData: row.profileData ? JSON.parse(row.profileData) : null,
          }
        : null;

      if (!user) {
        acc.push({
          id: row.id,
          username: row.username,
          email: row.email,
          avatar: row.avatar,
          links: linkData ? [linkData] : [],
        });
      } else if (linkData) {
        user.links.push(linkData);
      }
      return acc;
    }, []);

    res.json(featuredUsers.slice(0, 5));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
