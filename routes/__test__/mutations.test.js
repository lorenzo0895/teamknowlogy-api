const app = require("../../app");
const request = require("supertest");

describe("Test /mutations route", () => {
  it('Should get a 200 status code for horizontal mutations', async () => {
    const response = await request(app)
      .post("/mutations")
      .send({ dna: ["ACGT", "AAAA", "ACGT", "AAAA"] });
    expect(response.statusCode).toBe(200);
  });
  it('Should get a 200 status code for vertical mutations', async () => {
    const response = await request(app)
      .post("/mutations")
      .send({ dna: ["ACGT", "AGCT", "ACGT", "AGCT"] });
    expect(response.statusCode).toBe(200);
  });
  it('Should get a 200 status code for diagonal mutations', async () => {
    const response = await request(app)
      .post("/mutations")
      .send({ dna: ["ACGA", "AAAT", "TAAT", "AGAA"] });
    expect(response.statusCode).toBe(200);
  });
  it('Should get a 403 status code because mutation is not found', async () => {
    const response = await request(app)
      .post("/mutations")
      .send({ dna: ["ATCG", "CGAT", "AAAA", "CGAT"] });
    expect(response.statusCode).toBe(403);
  });
  it('Should get a 400 status code for invalid sequence', async () => {
    const response = await request(app)
      .post("/mutations")
      .send({ dna: ["XXXX", "XXXX"] });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Invalid DNA sequence");
  });
  it('Should get a 400 status code for dna empty', async () => {
    const response = await request(app).post("/mutations").send({});
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Property "dna" cannot be empty');
  });
});
