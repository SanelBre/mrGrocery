import { BadRequestError } from "../../utils/errors";
import { User, UserDoc } from "../../models/users";
import { Node } from "../../models/nodes";

export const getEmployeesByNodeId = async (
  nodeId: string
): Promise<UserDoc[]> => {
  const node = await Node.findById(nodeId);

  if (!node) throw new BadRequestError(`node id [${nodeId}] is not valid`);

  return Promise.all(
    node.employees.map(async (id) => {
      return User.findById(id);
    })
  );
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

  return [...descendantEmployees, ...employees];
};

export const getManagersByNodeId = async (
  nodeId: string
): Promise<UserDoc[]> => {
  const node = await Node.findById(nodeId);

  if (!node) throw new BadRequestError(`node id [${nodeId}] is not valid`);

  return Promise.all(
    node.managers.map(async (id) => {
      return User.findById(id);
    })
  );
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

  return [...descendantEmployees, ...managers];
};
