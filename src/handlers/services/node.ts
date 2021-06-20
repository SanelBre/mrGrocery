import { BadRequestError, NotFoundError } from "../../utils/errors";
import { User, UserDoc } from "../../models/users";
import { Node, NodeDoc, NodeType } from "../../models/nodes";

export const getNodeById = async (id: string): Promise<NodeDoc> => {
  const node = await Node.findById(id);

  if (!node) throw new NotFoundError(`node with id [${id}] is not found`);

  return node;
};

export const getNodeByUserId = async (userId: string): Promise<NodeDoc> => {
  const node = await Node.findByUserId(userId);

  if (!node) throw new NotFoundError("node was not found");

  return node;
};

export const getAllNodes = async (): Promise<NodeDoc[]> => {
  const nodes = await Node.find();

  return nodes ?? [];
};

export const getEmployeesByNodeId = async (
  nodeId: string
): Promise<UserDoc[]> => {
  const node = await getNodeById(nodeId);

  const employees = await Promise.all(
    node.employees.map(async (id) => {
      return User.findById(id);
    })
  );

  return employees?.filter((employee) => !employee.deleated);
};

export const getEmployeesWithDescendantsByNodeId = async (
  nodeId: string
): Promise<UserDoc[]> => {
  const node = await Node.findById(nodeId);

  if (!node) throw new BadRequestError(`node id [${nodeId}] is not valid`);

  const employees = await Promise.all(
    node.employees.map(async (id) => {
      return User.findById(id);
    })
  );

  if (!node.descendants?.length) return employees;

  const descendantEmployees = (
    await Promise.all(
      node.descendants.map(async (descendantId) => {
        return getEmployeesWithDescendantsByNodeId(descendantId);
      })
    )
  ).flat();

  return [...descendantEmployees, ...employees].filter(
    (employee) => !employee.deleated
  );
};

export const getManagersByNodeId = async (
  nodeId: string
): Promise<UserDoc[]> => {
  const node = await getNodeById(nodeId);

  const managers = await Promise.all(
    node.managers.map(async (id) => {
      return User.findById(id);
    })
  );

  return managers?.filter((manager) => !manager.deleated);
};

export const getManagersWithDescendantsByNodeId = async (
  nodeId: string
): Promise<UserDoc[]> => {
  const node = await Node.findById(nodeId);

  if (!node) throw new BadRequestError(`node id [${nodeId}] is not valid`);

  const managers = await Promise.all(
    node.managers.map(async (id) => {
      return User.findById(id);
    })
  );

  if (!node.descendants?.length) return managers;

  const descendantEmployees = (
    await Promise.all(
      node.descendants.map(async (descendantId) => {
        return getManagersWithDescendantsByNodeId(descendantId);
      })
    )
  ).flat();

  return [...descendantEmployees, ...managers].filter(
    (manager) => !manager.deleated
  );
};

export const updateNode = async (payload: {
  id: string;
  name?: string;
  nodeType?: NodeType["nodeType"];
}): Promise<void> => {
  const node = await Node.findById(payload.id);

  if (!node)
    throw new NotFoundError(`node with id [${payload.id}] is not found`);

  if (payload.name) node.name = payload.name;

  if (payload.nodeType) node.nodeType = payload.nodeType;

  await node.save();
};
