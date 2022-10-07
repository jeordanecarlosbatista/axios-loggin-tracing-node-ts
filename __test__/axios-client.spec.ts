import AxiosClient from "../src/axios-client";
import { v4 as uuid } from "uuid";

describe("tests on axios client", () => {
  it("Should return axios with successfully loggin", async () => {
    const headers = {
      "content-type": "application/json",
      "x-request-id": uuid(),
    };
    const baseUrl = "https://viacep.com.br/ws";
    const clientHttp = new AxiosClient({ baseUrl, headers });
    await clientHttp.getClient().get("01001000/json/");
  });

  it("Should return axios with error logging", async () => {
    const headers = {
      "content-type": "application/json",
      "x-request-id": uuid(),
    };
    const baseUrl = "https://viacep.com.br/ws";
    const clientHttp = new AxiosClient({ baseUrl, headers });
    await clientHttp.getClient().get("invalid/json/");
  });
});
