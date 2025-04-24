import { notFoundEndpoint } from "../middlewares/not-found-enpoint.middleware";
import express from 'express';

const router = express.Router();

// Handle 404 - Page Not Found for unmatched routes
router.use(notFoundEndpoint);

export default router;