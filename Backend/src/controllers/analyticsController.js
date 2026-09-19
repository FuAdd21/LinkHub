import {
  analyticsService,
  hashIp,
  detectDevice,
} from "../services/analyticsService.js";

export { hashIp, detectDevice };

// POST /api/analytics/click/:linkId — Track a link click (public)
export const trackClick = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const clientIp = req.ip || null;
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || null;

    const result = await analyticsService.trackClick(linkId, {
      ip: clientIp,
      userAgent,
      referrer,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/analytics/view/:username — Track a public profile page view (public)
export const trackProfileView = async (req, res, next) => {
  try {
    const { username } = req.params;
    const clientIp = req.ip || null;
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || null;

    const result = await analyticsService.trackProfileView(username, {
      ip: clientIp,
      userAgent,
      referrer,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/analytics/cta/:username — Track primary CTA click (public)
export const trackCtaClick = async (req, res, next) => {
  try {
    const { username } = req.params;
    const clientIp = req.ip || null;
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || null;

    const result = await analyticsService.trackCtaClick(username, {
      ip: clientIp,
      userAgent,
      referrer,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/analytics/project/:projectId — Track showcase project click (public)
export const trackProjectClick = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const clientIp = req.ip || null;
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || null;

    const result = await analyticsService.trackProjectClick(projectId, {
      ip: clientIp,
      userAgent,
      referrer,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics — Get analytics for authenticated user
export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days, 10) || 30;
    const data = await analyticsService.getDashboardAnalytics(userId, days);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
