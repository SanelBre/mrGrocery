import { User, UserDoc } from "../../models/users";
import { Node } from "../../models/nodes";

export const getEmployeesByNodeId = async (
  nodeId: string
): Promise<UserDoc[]> => {
  const node = await Node.findById(nodeId);

  const employees = await Promise.all(
    node.employees.map(async (id) => {
      return User.findById(id);
    })
  );

  return employees;
};

export const getEmployeesWithDescendantsByNodeId = async (
  nodeId: string
): Promise<UserDoc[]> => {
  const node = await Node.findByEmployeeId(nodeId);

  const employees = await Promise.all(
    node.employees.map(async (id) => {
      return User.findById(id);
    })
  );

  if (!node.descendants.length) return employees;

  const descendantEmployees = (
    await Promise.all(
      node.descendants.map(async (descendantId) => {
        return getEmployeesWithDescendantsByNodeId(descendantId);
      })
    )
  ).flat();

  return [...descendantEmployees, ...employees];
};
