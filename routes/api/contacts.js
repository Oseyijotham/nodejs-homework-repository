import express from "express";
import fs from "fs/promises";
import path from "path";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} from "../../models/contacts.js";

export const router = express.Router();

router.get("/", async (req, res, next) => {
  listContacts(res, next);
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  getContactById(id, res, next);
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  addContact({ name, email, phone }, res, next);
});

router.delete("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  removeContact(id, res, next);
});

router.put("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  updateContact(id, req.body, res, next);
});

export default router;
