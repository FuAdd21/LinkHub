import { linkService, syncLinkToSocialProfile } from "../services/linkService.js";

export { syncLinkToSocialProfile };

export const getLinks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const links = await linkService.getLinks(userId);
    res.json(links);
  } catch (err) {
    next(err);
  }
};

export const createLink = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, url, icon, scheduled_at, display_mode } = req.body;
    const link = await linkService.createLink(userId, {
      title,
      url,
      icon,
      scheduled_at,
      display_mode,
    });
    res.status(201).json({
      success: true,
      message: "Link created",
      link,
    });
  } catch (err) {
    next(err);
  }
};

export const updateLink = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { linkId } = req.params;
    const link = await linkService.updateLink(linkId, userId, req.body);
    res.json({
      success: true,
      message: "Link updated",
      link,
    });
  } catch (err) {
    next(err);
  }
};

export const updateDisplayMode = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { linkId } = req.params;
    const { display_mode } = req.body;
    const result = await linkService.updateDisplayMode(linkId, userId, display_mode);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const toggleVisibility = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { linkId } = req.params;
    const { is_visible } = req.body;
    const result = await linkService.toggleVisibility(linkId, userId, is_visible);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteLink = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { linkId } = req.params;
    await linkService.deleteLink(linkId, userId);
    res.json({ success: true, message: "Link deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const reorderLinks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ids = req.body.linkIds || req.body.orderedIds;
    await linkService.reorderLinks(userId, ids);
    res.json({ success: true, message: "Links reordered successfully" });
  } catch (err) {
    next(err);
  }
};
