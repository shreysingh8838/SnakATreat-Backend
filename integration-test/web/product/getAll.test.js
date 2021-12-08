const { request } = require("../../index");
const { Product } = require("../../../server/model");
const db = require("../../setup/db_setup");

const userData = {
  name: "Zell",
  email: "test@gmail.com",
  password: "Password2@",
  phone: "09036040503",
};

const productData = {
  name: "Jellof rice",
  price: 2000,
  countInStock: 2,
  description: "Jellof rice as you like it",
};
const productData2 = {
  name: "Fried rice",
  price: 4000,
  countInStock: 4,
  description: "Fried rice as you like it",
};
const productData3 = {
  name: "Bean cake",
  price: 4500,
  countInStock: 3,
  description: "Bean cake as you like it",
};

const apikey = process.env.API_KEY;

beforeEach(() => {
  const mockResponse = () => {
    const response = {};
    response.status = jest.fn().mockReturnValue(response);
    response.body = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    response.sendStatus = jest.fn().mockReturnValue(response);
    response.clearCookie = jest.fn().mockReturnValue(response);
    response.cookie = jest.fn().mockReturnValue(response);
    return response;
  };
  mockResponse();
});

/**
 * Product test
 */
describe("Product", () => {
  describe("Authentication", () => {
    db.setupDB();

    it("should respond with HTTP 401 for missing apikey", async (done) => {
      const response = await request.get("/api/product");

      expect(response.status).toBe(401);
      done();
    });

    it("should respond with product object for authenticated user", async (done) => {
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);
      token = token.body.data.token;

      const response = await request
        .get("/api/product")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.status).toBe(200);
      done();
    });
  });

  describe("Query Parameters", () => {
    db.setupDB();

    it("should respond with empty data object for invalid product query paramter  - search", async (done) => {
      const validProduct = new Product(productData);
      const savedProduct = await validProduct.save();
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);
      token = token.body.data.token;

      const response = await request
        .get("/api/product?search=likz")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeUndefined();
      expect(response.status).toBe(200);
      done();
    });
    it("should respond with data object for valid product query parameter  - search", async (done) => {
      const validProduct = new Product(productData);
      const savedProduct = await validProduct.save();
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);
      token = token.body.data.token;

      const response = await request
        .get("/api/product?search=like")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeDefined();
      expect(response.status).toBe(200);
      done();
    });
    it("should respond with empty data object for invalid product query parameter  - price", async (done) => {
      const validProduct = new Product(productData);
      const savedProduct = await validProduct.save();
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);
      token = token.body.data.token;

      const response = await request
        .get("/api/product?price=1-1000")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeUndefined();
      expect(response.status).toBe(200);
      done();
    });
    it("should respond with  data object for valid product query parameter  - price", async (done) => {
      const validProduct = new Product(productData);
      const savedProduct = await validProduct.save();
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);
      token = token.body.data.token;

      const response = await request
        .get("/api/product?price=1000-2000")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeDefined();
      expect(response.status).toBe(200);
      done();
    });
    it("should respond with  data object for valid product  query parameter  - price(multiple)", async (done) => {
      const validProduct = new Product(productData);
      const savedProduct = await validProduct.save();
      const validProduct2 = new Product(productData2);
      const savedProduct2 = await validProduct2.save();
      const validProduct3 = new Product(productData3);
      const savedProduct3 = await validProduct3.save();
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);
      token = token.body.data.token;

      const response = await request
        .get("/api/product?price=1000-2000,4100-*")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBe(2);
      expect(response.status).toBe(200);
      done();
    });

    it("should respond with empty data object for invalid product query parameter  - active", async (done) => {
      const validProduct = new Product(productData);
      const savedProduct = await validProduct.save();
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);
      token = token.body.data.token;

      const response = await request
        .get("/api/product?active=false")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeUndefined();
      expect(response.status).toBe(200);
      done();
    });
    it("should respond with empty data object for valid product query parameter  - active", async (done) => {
      const validProduct = new Product(productData);
      const savedProduct = await validProduct.save();
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);
      token = token.body.data.token;

      const response = await request
        .get("/api/product?active=true")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeDefined();
      expect(response.status).toBe(200);
      done();
    });
    it("should respond with empty data object for invalid product query parameter  - rating", async (done) => {
      const validProduct = new Product(productData);
      const savedProduct = await validProduct.save();
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);
      token = token.body.data.token;

      const response = await request
        .get("/api/product?rating=1")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeUndefined();
      expect(response.status).toBe(200);
      done();
    });
    it("should respond with empty data object for valid product query parameter  - rating", async (done) => {
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);

      const validProduct = new Product(productData);
      const review = {
        user: token.body.data._id,
        rating: 3,
        comment: "Great food",
      };
      token = token.body.data.token;

      await validProduct.addReview(review);
      const savedProduct = await validProduct.save();

      const response = await request
        .get("/api/product?rating=3")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeDefined();
      expect(response.status).toBe(200);
      done();
    });
    it("should respond with empty data object for invalid product query parameter  - reviews", async (done) => {
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);
      token = token.body.data.token;

      const validProduct = new Product(productData);

      const savedProduct = await validProduct.save();

      const response = await request
        .get("/api/product?reviews=1-3")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeUndefined();
      expect(response.status).toBe(200);
      done();
    });
    it("should respond with data object for valid product query parameter  - reviews", async (done) => {
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);

      const validProduct = new Product(productData);
      const review = {
        user: token.body.data._id,
        rating: 3,
        comment: "Great food",
      };
      token = token.body.data.token;

      await validProduct.addReview(review);
      const savedProduct = await validProduct.save();

      const response = await request
        .get("/api/product?reviews=1-3")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeDefined();
      expect(response.status).toBe(200);
      done();
    });

    it("should respond with data object for valid product query parameter  - reviews(multiple)", async (done) => {
      let token = await request
        .post("/api/signup")
        .send(userData)
        .set("apikey", apikey);

      const validProduct = new Product(productData);
      const review = {
        user: token.body.data._id,
        rating: 3,
        comment: "Great food",
      };
      token = token.body.data.token;

      await validProduct.addReview(review);
      const savedProduct = await validProduct.save();

      const response = await request
        .get("/api/product?reviews=1-*")
        .set("apikey", apikey)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0]).toBeDefined();
      expect(response.status).toBe(200);
      done();
    });
  });
});
