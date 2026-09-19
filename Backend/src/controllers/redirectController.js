import { linkRepository } from "../repositories/linkRepository.js";
import { analyticsRepository } from "../repositories/analyticsRepository.js";
import { hashIp, detectDevice } from "./analyticsController.js";
import { logger } from "../config/logger.js";

function isSafeRedirectUrl(targetUrl) {
  try {
    const parsed = new URL(targetUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * GET /r/:linkId
 * Server-authoritative click tracker & 302 redirect engine.
 * Ensures clicks are asynchronously captured and only safe protocols redirected.
 */
export const handleLinkRedirect = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const parsedLinkId = parseInt(linkId, 10);

    if (!parsedLinkId || parsedLinkId <= 0) {
      return res.status(400).send("Invalid link ID");
    }

    const link = await linkRepository.findByIdForRedirect(parsedLinkId);

    if (!link) {
      return res.status(404).send("Link not found");
    }

    // Check visibility
    if (!link.is_visible) {
      return res.status(404).send("This link is currently hidden");
    }

    // Check scheduling
    if (link.scheduled_at && new Date(link.scheduled_at) > new Date()) {
      return res.status(404).send("This link is scheduled for a future time");
    }

    // Validate protocol safety (prevent javascript: or data: injection)
    if (!isSafeRedirectUrl(link.url)) {
      return res.status(400).send("Invalid target URL scheme");
    }

    // Capture click metrics asynchronously without blocking redirect response
    const clientIp = req.ip || null;
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || null;
    const device = detectDevice(userAgent);
    const ip = hashIp(clientIp);

    // Fire-and-forget click tracking with deduplication
    (async () => {
      try {
        if (ip) {
          const recent = await analyticsRepository.findRecentClick(link.id, ip, 5);
          if (recent) return;
        }

        await analyticsRepository.recordClick({
          linkId: link.id,
          userId: link.user_id,
          ip,
          device,
          referrer,
        });
      } catch (clickErr) {
        logger.warn(`Server redirect click tracking error: ${clickErr.message}`);
      }
    })();

    // Perform HTTP 302 redirect to the destination URL
    res.redirect(302, link.url);
  } catch (err) {
    logger.error("handleLinkRedirect error:", err);
    res.status(500).send("Internal server error during link redirection");
  }
};
