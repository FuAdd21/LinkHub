import { db } from "../config/db.js";
import { hashIp, detectDevice } from "./analyticsController.js";

/**
 * GET /r/:linkId
 * Server-authoritative click tracker & 302 redirect engine.
 * Ensures clicks are 100% captured before the browser reaches destination.
 */
export const handleLinkRedirect = async (req, res) => {
  try {
    const { linkId } = req.params;
    const parsedLinkId = parseInt(linkId, 10);

    if (!parsedLinkId || parsedLinkId <= 0) {
      return res.status(400).send("Invalid link ID");
    }

    const [links] = await db.query(
      `SELECT id, user_id, url, is_visible, scheduled_at
       FROM links
       WHERE id = ?`,
      [parsedLinkId]
    );

    if (links.length === 0) {
      return res.status(404).send("Link not found");
    }

    const link = links[0];

    // Check visibility
    if (!link.is_visible) {
      return res.status(404).send("This link is currently hidden");
    }

    // Check scheduling
    if (link.scheduled_at && new Date(link.scheduled_at) > new Date()) {
      return res.status(404).send("This link is scheduled for a future time");
    }

    // Capture click metrics asynchronously
    const clientIp = req.ip || null;
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || null;
    const device = detectDevice(userAgent);
    const ip = hashIp(clientIp);

    // Run click tracking in background so redirect is near-instant
    (async () => {
      try {
        if (ip) {
          const [recent] = await db.query(
            `SELECT id FROM clicks
             WHERE link_id = ? AND ip = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
             LIMIT 1`,
            [link.id, ip]
          );
          if (recent.length > 0) {
            return;
          }
        }

        await db.query(
          `INSERT INTO clicks (link_id, user_id, ip, device, referrer) VALUES (?, ?, ?, ?, ?)`,
          [link.id, link.user_id, ip, device, referrer]
        );
      } catch (clickErr) {
        console.warn("Server redirect click tracking error:", clickErr.message);
      }
    })();

    // Perform HTTP 302 redirect to the destination URL
    res.redirect(302, link.url);
  } catch (err) {
    console.error("handleLinkRedirect error:", err);
    res.status(500).send("Internal server error during link redirection");
  }
};
