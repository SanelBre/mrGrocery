import * as nodeServices from "./node";
import { Node } from "../../models/nodes";
import { User } from "../../models/users";
import { sampleNodeDoc, sampleUserDoc } from "../../utils/test";

describe("node services", () => {
  const findByIdMock = jest.spyOn(Node, "findById");
  const findByUserIdMock = jest.spyOn(Node, "findByUserId");
  const findMock = jest.spyOn(Node, "find");
  const userFindByIdSpy = jest.spyOn(User, "findById");

  describe("getNodeById", () => {
    it("should successfully execute with a node", async () => {
      const sampleNode = sampleNodeDoc();
      findByIdMock.mockResolvedValueOnce(sampleNode);

      const response = await nodeServices.getNodeById("someNodeId");

      expect(response).toStrictEqual(sampleNode);
    });

    it("should throw if no node was found", async () => {
      findByIdMock.mockResolvedValueOnce(null);

      await expect(nodeServices.getNodeById("someNodeId")).rejects.toThrow();
    });
  });

  describe("getNodeByUserId", () => {
    it("should successfully execute with a node", async () => {
      const sampleNode = sampleNodeDoc();
      findByUserIdMock.mockResolvedValueOnce(sampleNode);

      const response = await nodeServices.getNodeByUserId("someUserId");

      expect(response).toStrictEqual(sampleNode);
    });

    it("should throw if no node was found", async () => {
      findByUserIdMock.mockResolvedValueOnce(null);

      await expect(
        nodeServices.getNodeByUserId("someNodeId")
      ).rejects.toThrow();
    });
  });

  describe("getEmployeesByNodeId", () => {
    const getNodeByIdSpy = jest.spyOn(nodeServices, "getNodeById");
    it("should successfully execute with a list of employees", async () => {
      const sampleNode = sampleNodeDoc({
        employees: ["emp1", "emp2"],
      });
      getNodeByIdSpy.mockResolvedValueOnce(sampleNode);

      userFindByIdSpy.mockResolvedValueOnce(
        sampleUserDoc({
          username: "emp1",
          role: "employee",
        })
      );
      userFindByIdSpy.mockResolvedValueOnce(
        sampleUserDoc({
          username: "emp2",
          role: "employee",
        })
      );
      const response = await nodeServices.getEmployeesByNodeId("someNodeId");

      expect(response).toHaveLength(2);
      expect(response[0].username).toBe("emp1");
      expect(response[1].username).toBe("emp2");
    });

    it("should successfully execute with a empty list, since users are deleated", async () => {
      const sampleNode = sampleNodeDoc({
        employees: ["emp1", "emp2"],
      });
      getNodeByIdSpy.mockResolvedValueOnce(sampleNode);

      userFindByIdSpy.mockResolvedValueOnce(
        sampleUserDoc({
          username: "emp1",
          role: "employee",
          deleated: true,
        })
      );
      userFindByIdSpy.mockResolvedValueOnce(
        sampleUserDoc({
          username: "emp2",
          role: "employee",
          deleated: true,
        })
      );
      const response = await nodeServices.getEmployeesByNodeId("someNodeId");

      expect(response).toHaveLength(0);
    });
  });

  describe("getAllNodes", () => {
    it("should successfully execute with an list with a single record", async () => {
      findMock.mockResolvedValueOnce([sampleNodeDoc()]);
      const response = await nodeServices.getAllNodes();

      expect(response).toHaveLength(1);
    });

    it("should successfully execute with an empty list", async () => {
      findMock.mockResolvedValueOnce(null);
      const response = await nodeServices.getAllNodes();

      expect(response).toHaveLength(0);
      expect(Array.isArray(response)).toBeTruthy();
    });
  });

  describe("getEmployeesWithDescendantsByNodeId", () => {
    beforeEach(() => {
      userFindByIdSpy.mockReset();
    });

    it("should successfuly exeucte with a list of employees", async () => {
      const sampleNode = sampleNodeDoc({
        descendants: ["descId1", "descId2"],
        employees: ["employeeId"],
      });
      findByIdMock.mockResolvedValueOnce(sampleNode);
      const sampleNodeDesc = sampleNodeDoc({
        descendants: [],
        employees: ["employeeId"],
      });
      findByIdMock.mockResolvedValueOnce(sampleNodeDesc);
      findByIdMock.mockResolvedValueOnce(sampleNodeDesc);

      userFindByIdSpy.mockResolvedValue(
        sampleUserDoc({
          username: "emp",
          role: "employee",
          deleated: false,
        })
      );

      const response = await nodeServices.getEmployeesWithDescendantsByNodeId(
        "someNodeId"
      );

      expect(response).toHaveLength(3);
    });

    it("should successfuly exeucte with empty list, since all  employees are deleated", async () => {
      const sampleNode = sampleNodeDoc({
        descendants: ["descId1", "descId2"],
        employees: ["employeeId"],
      });
      findByIdMock.mockResolvedValueOnce(sampleNode);
      const sampleNodeDesc = sampleNodeDoc({
        descendants: [],
        employees: ["employeeId"],
      });
      findByIdMock.mockResolvedValueOnce(sampleNodeDesc);
      findByIdMock.mockResolvedValueOnce(sampleNodeDesc);

      userFindByIdSpy.mockResolvedValue(
        sampleUserDoc({
          username: "emp",
          role: "employee",
          deleated: true,
        })
      );

      const response = await nodeServices.getEmployeesWithDescendantsByNodeId(
        "someNodeId"
      );

      expect(response).toHaveLength(0);
      expect(Array.isArray(response)).toBeTruthy();
      expect(userFindByIdSpy).toBeCalledTimes(3);
    });

    it("should fail if no node found", async () => {
      findByIdMock.mockResolvedValueOnce(null);

      await expect(
        nodeServices.getEmployeesWithDescendantsByNodeId("someNodeId")
      ).rejects.toThrow();
    });
  });

  describe("getManagersByNodeId", () => {
    const getNodeByIdSpy = jest.spyOn(nodeServices, "getNodeById");
    it("shoudld successfully execute with a list of users for a node id", async () => {
      const sampleNode = sampleNodeDoc({
        managers: ["mng1", "mng2"],
      });

      getNodeByIdSpy.mockResolvedValueOnce(sampleNode);

      userFindByIdSpy.mockResolvedValueOnce(
        sampleUserDoc({
          username: "mng1",
          role: "manager",
        })
      );
      userFindByIdSpy.mockResolvedValueOnce(
        sampleUserDoc({
          username: "mng2",
          role: "manager",
        })
      );
      const response = await nodeServices.getManagersByNodeId("someNodeId");

      expect(response).toHaveLength(2);
      expect(response[0].username).toBe("mng1");
      expect(response[1].username).toBe("mng2");
    });

    it("should successfully execute with a empty list, since users are deleated", async () => {
      const sampleNode = sampleNodeDoc({
        employees: ["mng1", "mng2"],
      });
      getNodeByIdSpy.mockResolvedValueOnce(sampleNode);

      userFindByIdSpy.mockResolvedValueOnce(
        sampleUserDoc({
          username: "mng1",
          role: "manager",
          deleated: true,
        })
      );
      userFindByIdSpy.mockResolvedValueOnce(
        sampleUserDoc({
          username: "mng2",
          role: "manager",
          deleated: true,
        })
      );
      const response = await nodeServices.getManagersByNodeId("someNodeId");

      expect(response).toHaveLength(0);
    });
  });

  describe("getManagersWithDescendantsByNodeId", () => {
    beforeEach(() => {
      userFindByIdSpy.mockReset();
      userFindByIdSpy.mockReset();
    });

    it("should successfuly exeucte with a list of managers", async () => {
      const sampleNode = sampleNodeDoc({
        descendants: ["descId1", "descId2"],
        managers: ["managerId"],
      });
      findByIdMock.mockResolvedValueOnce(sampleNode);

      const sampleNodeDesc = sampleNodeDoc({
        descendants: [],
        managers: ["managerId"],
      });

      findByIdMock.mockResolvedValueOnce(sampleNodeDesc);
      findByIdMock.mockResolvedValueOnce(sampleNodeDesc);

      userFindByIdSpy.mockResolvedValue(
        sampleUserDoc({
          username: "mng",
          role: "manager",
          deleated: false,
        })
      );

      const response = await nodeServices.getManagersWithDescendantsByNodeId(
        "someNodeId"
      );

      expect(response).toHaveLength(3);
    });

    it("should successfuly exeucte with empty list, since all managers are deleated", async () => {
      const sampleNode = sampleNodeDoc({
        descendants: ["descId1", "descId2"],
        managers: ["managerId"],
      });
      findByIdMock.mockResolvedValueOnce(sampleNode);
      const sampleNodeDesc = sampleNodeDoc({
        descendants: [],
        managers: ["managerId"],
      });
      findByIdMock.mockResolvedValueOnce(sampleNodeDesc);
      findByIdMock.mockResolvedValueOnce(sampleNodeDesc);

      userFindByIdSpy.mockResolvedValue(
        sampleUserDoc({
          username: "mng",
          role: "manager",
          deleated: true,
        })
      );

      const response = await nodeServices.getManagersWithDescendantsByNodeId(
        "someNodeId"
      );

      expect(response).toHaveLength(0);
      expect(Array.isArray(response)).toBeTruthy();
      expect(userFindByIdSpy).toBeCalledTimes(3);
    });

    it("should fail if no node found", async () => {
      findByIdMock.mockResolvedValueOnce(null);

      await expect(
        nodeServices.getManagersWithDescendantsByNodeId("someNodeId")
      ).rejects.toThrow();
    });
  });

  describe("updateNode", () => {
    it("should successfully update node name", async () => {
      const sampleNode = sampleNodeDoc();
      findByIdMock.mockResolvedValueOnce(sampleNode);

      const newNodeName = "newNodeName";

      await nodeServices.updateNode({
        id: "someNodeId",
        name: newNodeName,
      });

      expect(sampleNode.name).toBe(newNodeName);
    });

    it("should successfully update node type", async () => {
      const sampleNode = sampleNodeDoc();
      findByIdMock.mockResolvedValueOnce(sampleNode);

      const newNodeType = "store" as const;

      await nodeServices.updateNode({
        id: "someNodeId",
        nodeType: newNodeType,
      });

      expect(sampleNode.nodeType).toBe(newNodeType);
    });
  });
});
