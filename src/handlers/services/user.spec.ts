import { User, UserDoc } from "../../models/users";
import { NodeDoc } from "../../models/nodes";
import { sampleUserDoc, sampleNodeDoc } from "../../utils/test";
import * as userServices from "./user";
import * as nodeServices from "./node";

describe("user services", () => {
  const findByIdMock = jest.spyOn(User, "findById");
  const findByUsernameMock = jest.spyOn(User, "findByUsername");

  describe("getUserById", () => {
    it("should successfully execute with a user", async () => {
      const userSample = sampleUserDoc();
      findByIdMock.mockResolvedValueOnce(userSample);

      const response = await userServices.getUserById("someUserId");

      expect(response).toStrictEqual(userSample);
    });

    it("should fail if the found user is deleated", async () => {
      findByIdMock.mockResolvedValueOnce(
        sampleUserDoc({
          deleated: true,
        })
      );

      await expect(userServices.getUserById("someUserId")).rejects.toThrow();
    });

    it("should fail if no user is found", async () => {
      findByIdMock.mockResolvedValueOnce(null);

      await expect(userServices.getUserById("someUserId")).rejects.toThrow();
    });
  });

  describe("getUserByUsername", () => {
    it("should successfully execute with a user", async () => {
      const userSample = sampleUserDoc();
      findByUsernameMock.mockResolvedValueOnce(userSample);

      const response = await userServices.getUserByUsername("someUsername");

      expect(response).toStrictEqual(userSample);
    });

    it("should fail if the found user is deleated", async () => {
      findByUsernameMock.mockResolvedValueOnce(
        sampleUserDoc({
          deleated: true,
        })
      );

      await expect(
        userServices.getUserByUsername("someUsername")
      ).rejects.toThrow();
    });

    it("should fail if no user is found", async () => {
      findByUsernameMock.mockResolvedValueOnce(null);

      await expect(
        userServices.getUserByUsername("someUsername")
      ).rejects.toThrow();
    });
  });

  describe("getNodeUsersByUserId", () => {
    const getUserByIdSpy = jest.spyOn(userServices, "getUserById");

    const getNodeByUserIdSpy = jest.spyOn(nodeServices, "getNodeByUserId");

    describe("manager triggers", () => {
      beforeEach(() => {
        getUserByIdSpy.mockResolvedValueOnce(
          sampleUserDoc({
            username: "initalUser",
            role: "manager",
          })
        );
      });

      it("should successfully execute with two employee users", async () => {
        getNodeByUserIdSpy.mockResolvedValueOnce(
          sampleNodeDoc({
            employees: ["someAdditionalEmployee1", "someAdditionalEmployee2"],
            managers: [],
          })
        );

        findByIdMock.mockResolvedValueOnce(
          sampleUserDoc({
            username: "additionalUser1",
          })
        );
        findByIdMock.mockResolvedValueOnce(
          sampleUserDoc({
            username: "additionalUser2",
          })
        );

        const response = await userServices.getNodeUsersByUserId("someUserId");

        expect(response).toHaveLength(2);
        expect(response[0].username).toBe("additionalUser1");
        expect(response[1].username).toBe("additionalUser2");
      });

      it("should successfully execute with one employee and one manager user", async () => {
        getNodeByUserIdSpy.mockResolvedValueOnce(
          sampleNodeDoc({
            employees: ["someAdditionalEmployee"],
            managers: ["someAdditionalManager"],
          })
        );

        const users = ["additionalUser1", "additionalUser2"];

        findByIdMock.mockResolvedValueOnce(
          sampleUserDoc({
            username: users[0],
            role: "employee",
          })
        );
        findByIdMock.mockResolvedValueOnce(
          sampleUserDoc({
            username: users[1],
            role: "manager",
          })
        );

        const response = await userServices.getNodeUsersByUserId("someUserId");

        expect(response).toHaveLength(2);
        expect(response[0].username).toBe(users[0]);
        expect(response[1].username).toBe(users[1]);
      });
    });
    describe("employee triggers", () => {
      beforeEach(() => {
        getUserByIdSpy.mockResolvedValueOnce(
          sampleUserDoc({
            username: "initalUser",
            role: "employee",
          })
        );
      });

      it("should successfully execute with two employee users", async () => {
        getNodeByUserIdSpy.mockResolvedValueOnce(
          sampleNodeDoc({
            employees: ["someAdditionalEmployee1", "someAdditionalEmployee2"],
            managers: [],
          })
        );

        findByIdMock.mockResolvedValueOnce(
          sampleUserDoc({
            username: "additionalUser1",
            role: "employee",
          })
        );
        findByIdMock.mockResolvedValueOnce(
          sampleUserDoc({
            username: "additionalUser2",
            role: "employee",
          })
        );

        const response = await userServices.getNodeUsersByUserId("someUserId");

        expect(response).toHaveLength(2);
        expect(response[0].username).toBe("additionalUser1");
        expect(response[1].username).toBe("additionalUser2");
      });

      it("should successfully execute with one employee user", async () => {
        getNodeByUserIdSpy.mockResolvedValueOnce(
          sampleNodeDoc({
            employees: ["someAdditionalEmployee"],
            managers: ["someAdditionalManager"],
          })
        );

        const users = ["additionalUser1", "additionalUser2"];

        findByIdMock.mockResolvedValueOnce(
          sampleUserDoc({
            username: users[0],
            role: "employee",
          })
        );
        findByIdMock.mockResolvedValueOnce(
          sampleUserDoc({
            username: users[1],
            role: "manager",
          })
        );

        const response = await userServices.getNodeUsersByUserId("someUserId");

        expect(response).toHaveLength(1);
        expect(response[0].username).toBe(users[0]);
      });

      it("should successfully execute with an empty list", async () => {
        getNodeByUserIdSpy.mockResolvedValueOnce(
          sampleNodeDoc({
            employees: [],
            managers: ["someAdditionalEmployee", "someAdditionalManager"],
          })
        );

        const response = await userServices.getNodeUsersByUserId("someUserId");

        expect(response).toHaveLength(0);
      });
    });
  });

  describe("updateUser", () => {
    const getUserByIdSpy = jest.spyOn(userServices, "getUserById");
    let sampleUser: UserDoc;

    beforeEach(() => {
      sampleUser = sampleUserDoc();
      getUserByIdSpy.mockResolvedValueOnce(sampleUser);
    });

    it("should execute successfully with a new username", async () => {
      const saveSpy = jest.spyOn(sampleUser, "save");

      const newUsername = "someNewUsername";
      const oldRole = "manager";

      await userServices.updateUser({
        id: "someUserId",
        username: newUsername,
      });

      expect(sampleUser.username).toBe(newUsername);
      expect(sampleUser.role).toBe(oldRole);
      expect(saveSpy).toBeCalled();
    });

    it("should execute successfully with a new role", async () => {
      const saveSpy = jest.spyOn(sampleUser, "save");
      const oldUsername = "someUsername";
      const newRole = "employee";
      await userServices.updateUser({
        id: "someUserId",
        role: newRole,
      });

      expect(sampleUser.role).toBe(newRole);
      expect(sampleUser.username).toBe(oldUsername);
      expect(saveSpy).toBeCalled();
    });
  });

  describe("deleteUserById", () => {
    const getUserByIdSpy = jest.spyOn(userServices, "getUserById");
    let sampleUser: UserDoc;

    beforeEach(() => {
      sampleUser = sampleUserDoc();
      getUserByIdSpy.mockResolvedValueOnce(sampleUser);
    });

    it("should successfully delete the user", async () => {
      await userServices.deleteUserById("someUserId");

      expect(sampleUser.deleated).toBeTruthy();
    });
  });

  describe("createUser", () => {
    const getUserByUsernameSpy = jest.spyOn(userServices, "getUserByUsername");
    const createSpy = jest.spyOn(User, "create");
    const getNodeByIdSpy = jest.spyOn(nodeServices, "getNodeById");
    let sampleUser: UserDoc;
    let sampleNode: NodeDoc;

    beforeEach(() => {
      sampleNode = sampleNodeDoc();
      sampleUser = sampleUserDoc();
    });

    it("should successfully create a user", async () => {
      getUserByUsernameSpy.mockResolvedValueOnce(null);
      getNodeByIdSpy.mockResolvedValueOnce(sampleNode);

      const newUserUsername = "someNewUsername";
      const newUserRole = "manager";
      const newUserEmail = "some@email.com";

      const newlyCreatedUser = sampleUserDoc({
        username: newUserUsername,
        role: newUserRole,
        email: newUserEmail,
      });
      createSpy.mockResolvedValueOnce(newlyCreatedUser);

      const response = await userServices.createUser({
        username: newUserUsername,
        role: newUserRole,
        nodeId: "someNodeId",
        email: newUserEmail,
      });

      expect(sampleNode.managers.includes(response._id)).toBeTruthy();
      expect(response.username).toBe(newUserUsername);
      expect(response.role).toBe(newUserRole);
      expect(response.email).toBe(newUserEmail);
    });

    it("should fail to create a user if username already taken", async () => {
      getUserByUsernameSpy.mockResolvedValueOnce(sampleUser);
      getNodeByIdSpy.mockResolvedValueOnce(sampleNode);

      const newUserUsername = "existingUsername";
      const newUserRole = "employee";
      const newUserEmail = "some@email.com";

      await expect(
        userServices.createUser({
          username: newUserUsername,
          role: newUserRole,
          nodeId: "someNodeId",
          email: newUserEmail,
        })
      ).rejects.toThrow();
    });
  });
});
