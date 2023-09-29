const app = require("../../app");
const request = require("supertest");

describe("Test /mutations route", () => {
  it('Should get a 200 status code on "/stats"', async () => {
    const response = await request(app).get("/stats");
    expect(response.statusCode).toBe(200);
  });
  it('Should get all properties on "/stats"', async () => {
    const response = await request(app).get("/stats");
    expect(response.body).toHaveProperty("count_mutations");
    expect(response.body).toHaveProperty("count_no_mutations");
    expect(response.body).toHaveProperty("ratio");
  });
  it("Should calculate the ratio", async () => {
    const response = await request(app).get("/stats");
    const { count_mutations, count_no_mutations, ratio } = response.body;
    const _ratio =
      count_no_mutations === 0 ? 0 : count_mutations / count_no_mutations;
    const calculatedRatio = Math.round(_ratio * 100) / 100;
    expect(ratio).toBe(calculatedRatio);
  });
});
