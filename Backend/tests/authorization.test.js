import test from "node:test";
import assert from "node:assert/strict";
import { linkService } from "../src/services/linkService.js";
import { projectService } from "../src/services/projectService.js";
import { linkRepository } from "../src/repositories/linkRepository.js";
import { projectRepository } from "../src/repositories/projectRepository.js";
import { AppError } from "../src/errors/AppError.js";

test("Cross-User Authorization & Security Suite", async (t) => {
  const USER_A_ID = 101;
  const USER_B_ID = 202;

  await t.test("user cannot update another user's link", async () => {
    // Mock linkRepository.findById with user isolation
    const originalFindById = linkRepository.findById;
    linkRepository.findById = async (linkId, userId) => {
      if (userId === USER_B_ID) {
        return {
          id: linkId,
          user_id: USER_B_ID,
          title: "User B's Private Link",
          url: "https://example.com/b",
        };
      }
      return null;
    };

    try {
      await assert.rejects(
        async () => {
          // linkService.updateLink(linkId, userId, updates)
          await linkService.updateLink(999, USER_A_ID, { title: "Hacked Title" });
        },
        (err) => {
          assert(err instanceof AppError);
          assert([403, 404].includes(err.statusCode));
          return true;
        }
      );
    } finally {
      linkRepository.findById = originalFindById;
    }
  });

  await t.test("user cannot delete another user's link", async () => {
    const originalFindById = linkRepository.findById;
    linkRepository.findById = async (linkId, userId) => {
      if (userId === USER_B_ID) {
        return {
          id: linkId,
          user_id: USER_B_ID,
          title: "User B's Private Link",
        };
      }
      return null;
    };

    try {
      await assert.rejects(
        async () => {
          // linkService.deleteLink(linkId, userId)
          await linkService.deleteLink(999, USER_A_ID);
        },
        (err) => {
          assert(err instanceof AppError);
          assert([403, 404].includes(err.statusCode));
          return true;
        }
      );
    } finally {
      linkRepository.findById = originalFindById;
    }
  });

  await t.test("user cannot update another user's project", async () => {
    const originalFindById = projectRepository.findById;
    projectRepository.findById = async (projectId) => {
      return {
        id: projectId,
        user_id: USER_B_ID,
        title: "User B's Showcase Project",
      };
    };

    try {
      await assert.rejects(
        async () => {
          await projectService.updateProject(USER_A_ID, 888, { title: "Unauthorized Rename" });
        },
        (err) => {
          assert(err instanceof AppError);
          assert.equal(err.statusCode, 403);
          assert(/permission/i.test(err.message));
          return true;
        }
      );
    } finally {
      projectRepository.findById = originalFindById;
    }
  });

  await t.test("user cannot delete another user's project", async () => {
    const originalFindById = projectRepository.findById;
    projectRepository.findById = async (projectId) => {
      return {
        id: projectId,
        user_id: USER_B_ID,
        title: "User B's Showcase Project",
      };
    };

    try {
      await assert.rejects(
        async () => {
          await projectService.deleteProject(USER_A_ID, 888);
        },
        (err) => {
          assert(err instanceof AppError);
          assert.equal(err.statusCode, 403);
          return true;
        }
      );
    } finally {
      projectRepository.findById = originalFindById;
    }
  });

  await t.test("user cannot reorder with foreign project IDs", async () => {
    const originalFindByUserId = projectRepository.findByUserId;
    projectRepository.findByUserId = async (userId) => {
      return [
        { id: 1, user_id: userId },
        { id: 2, user_id: userId },
      ];
    };

    try {
      await assert.rejects(
        async () => {
          // Trying to inject project ID 999 which does not belong to USER_A
          await projectService.reorderProjects(USER_A_ID, [1, 999]);
        },
        (err) => {
          assert(err instanceof AppError);
          assert.equal(err.statusCode, 403);
          assert(/Invalid project ID/i.test(err.message));
          return true;
        }
      );
    } finally {
      projectRepository.findByUserId = originalFindByUserId;
    }
  });
});
