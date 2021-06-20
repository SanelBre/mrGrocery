import { sampleUserDoc } from "../../utils/test";
import * as authServices from "./authenticate";
import * as userServices from "./user";

describe("authentication services", () => {
  describe("authenticate", () => {
    const getUserByUsernameSpy = jest.spyOn(userServices, "getUserByUsername");

    it("should successfully authenticate user with the provided username", async () => {
      const sampleUsrer = sampleUserDoc();
      getUserByUsernameSpy.mockResolvedValueOnce(sampleUsrer);

      const spySave = jest.spyOn(sampleUsrer, "save");

      expect(sampleUsrer.token).toBeFalsy();

      await authServices.authenticate("someUsername");

      expect(spySave).toBeCalled();
      expect(sampleUsrer.token).toBe("newToken");
    });
  });

  describe("unauthenticate", () => {
    const getUserByIdSpy = jest.spyOn(userServices, "getUserById");

    it("should successfully user with the provided username", async () => {
      const sampleUsrer = sampleUserDoc();
      getUserByIdSpy.mockResolvedValueOnce(sampleUsrer);

      const spySave = jest.spyOn(sampleUsrer, "save");

      await authServices.unauthenticate("someUserId");

      expect(spySave).toBeCalled();
      expect(sampleUsrer.token).toBeNull();
    });
  });
});
