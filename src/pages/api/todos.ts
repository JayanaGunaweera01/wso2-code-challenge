import { createTodoForUser } from "@/svc/backend.client";
import {
  getNextAuthServerSession,
  getUserIdFromSeesion,
} from "@/utils/session";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getNextAuthServerSession({ req, res });
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  const userId = getUserIdFromSeesion(session)!;
  if (req.method === "POST") {
    const { title, description } = req.body;
    try {
      await createTodoForUser(userId, { title, description, completed: false });
      res.status(200).send({ message: "Todo item created" });
    } catch (err) {
      res.status(500).send({ error: "Failed to create todo item" });
    }
    return;
  }
  return res.status(405).send({ error: "Method not allowed" });
}
