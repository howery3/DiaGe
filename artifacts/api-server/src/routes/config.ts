import { Router } from "express";

const router = Router();

router.get("/config", (_req, res) => {
  res.json({
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY ?? "",
  });
});

export default router;
