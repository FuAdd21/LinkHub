import { socialService } from "../services/socialService.js";

// GET /api/integrations — Fetch user's integrations
export const getIntegrations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await socialService.getIntegrations(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /api/integrations/connect — Connect a platform
export const connectIntegration = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { provider, handle, followers, addToLinks, avatar } = req.body;
    const result = await socialService.connectIntegration(
      userId,
      provider,
      handle,
      followers,
      addToLinks === true,
      avatar
    );
    res.json({
      message: `${provider} integration saved successfully`,
      integration: result,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/integrations/sync — Trigger re-sync
export const syncIntegration = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const provider = req.params.provider || req.body?.provider;
    if (!provider) {
      return res.status(400).json({ message: "Provider is required" });
    }
    const result = await socialService.syncIntegration(userId, provider);
    res.json({
      message: `${provider} metrics synchronized successfully`,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/integrations/:provider or POST /api/integrations/disconnect — Disconnect
export const disconnectIntegration = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const provider = req.params.provider || req.body?.provider;
    if (!provider) {
      return res.status(400).json({ message: "Provider is required" });
    }
    await socialService.disconnectIntegration(userId, provider);
    res.json({ message: `${provider} integration removed successfully` });
  } catch (err) {
    next(err);
  }
};

// POST /api/integrations/preview — Live preview before saving
export const previewIntegration = async (req, res, next) => {
  try {
    const { provider, handle } = req.body;
    const data = await socialService.previewIntegration(provider, handle);
    res.json({ preview: data });
  } catch (err) {
    next(err);
  }
};

// POST /api/integrations/sync-all — Batch sync all connected integrations
export const syncAllIntegrations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { integrations } = await socialService.getIntegrations(userId);
    const connected = integrations.filter((i) => i.status === "connected" || i.status === "stale");

    let synced = 0;
    for (const item of connected) {
      try {
        await socialService.syncIntegration(userId, item.provider);
        synced++;
      } catch {}
    }

    res.json({ message: `Synchronized ${synced} integrations successfully` });
  } catch (err) {
    next(err);
  }
};

// POST /api/integrations/toggle — Toggle connection status
export const toggleIntegration = async (req, res, next) => {
  try {
    if (req.body.status === "available") {
      req.params = { provider: req.body.provider };
      return disconnectIntegration(req, res, next);
    }
    return connectIntegration(req, res, next);
  } catch (err) {
    next(err);
  }
};

