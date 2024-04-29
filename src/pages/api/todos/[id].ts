import {
  createTodoForUser,
  deleteTodoForUser,
  updateTodoForUser,
} from "@/svc/backend.client";
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
  const todoIdStr = req.query.id as string;
  const todoId = parseInt(todoIdStr);
  if (isNaN(todoId)) {
    res.status(400).json({ message: "Invalid todo ID" });
    return;
  }
  if (req.method === "PUT") {
    const { title, description, completed } = req.body;
    try {
      await updateTodoForUser(userId, todoId, {
        title,
        description,
        completed,
      });
      res.status(200).send({ message: "Todo item updated" });
    } catch (err) {
      res.status(500).send({ error: "Failed to update todo item" });
    }
    return;
  }
  if (req.method === "DELETE") {
    try {
      await deleteTodoForUser(userId, todoId);
      res.status(200).send({ message: "Todo item deleted" });
    } catch (err) {
      res.status(500).send({ error: "Failed to delete todo item" });
    }
    return;
  }
  return res.status(405).send({ error: "Method not allowed" });
}
