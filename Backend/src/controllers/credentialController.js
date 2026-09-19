import { credentialRepository } from "../repositories/credentialRepository.js";
import { AppError } from "../errors/AppError.js";

export const getCredentials = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await credentialRepository.findByUserId(userId);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

export const createCredential = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const item = await credentialRepository.create(userId, req.validated);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const updateCredential = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const existing = await credentialRepository.findById(id);
    if (!existing) throw AppError.notFound("Credential not found");
    if (existing.user_id !== userId) throw AppError.forbidden("Access denied");

    const updated = await credentialRepository.update(id, req.validated);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCredential = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const existing = await credentialRepository.findById(id);
    if (!existing) throw AppError.notFound("Credential not found");
    if (existing.user_id !== userId) throw AppError.forbidden("Access denied");

    await credentialRepository.delete(id);
    res.json({ success: true, message: "Credential deleted successfully" });
  } catch (err) {
    next(err);
  }
};
