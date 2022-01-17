import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("GET /", function () {
  it("should response 200 status code", async function () {
    const response = await request(app).get("/");
    expect(response.statusCode).to.be.equals(200);
  });

  it("should response correct JSON message", async function () {
    const response = await request(app).get("/");
    expect(response.body.message).to.be.equals("Welcome to the API");
  });
});
