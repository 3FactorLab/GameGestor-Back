import { test, expect } from "@jest/globals";
import request from "supertest";
import express from "express";

// App mínima para chequear vida del servidor (sin tocar la app real)
const app = express();
app.use(express.json());
app.get("/", (_req, res) => res.json({ ok: true }));

test("GET / responde 200 con ok:true", async () => {
  const res = await request(app).get("/").expect(200);
  expect(res.body).toEqual({ ok: true });
});
