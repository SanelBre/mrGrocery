import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface NodeType {
  _id?: string;
  name: string;
  managers: string[];
  employees: string[];
  descendants?: string[];
  nodeType?: "office" | "store";
}

export type NodeDoc = NodeType & mongoose.Document;

type NodeModel = mongoose.Model<NodeDoc> & {
  findByEmployeeId: (id: string) => Promise<NodeDoc>;
  findByManagerId: (id: string) => Promise<NodeDoc>;
};

const nodeSchema = new mongoose.Schema<NodeDoc, NodeModel>(
  {
    _id: { type: String, default: () => uuidv4() },
    name: {
      type: String,
      required: true,
    },
    managers: [String],
    employees: [String],
    descendants: [String],
    nodeType: {
      type: String,
      enum: ["office", "store"],
      default: "office",
    },
  },
  {
    _id: false,
    versionKey: false,
    collection: "grocery_nodes",
  }
);

nodeSchema.statics.findByEmployeeId = async function (
  employeeId: string
): Promise<NodeDoc> {
  const node = await this.findOne({ employees: { $in: [employeeId] } }).exec();
  return node;
};

nodeSchema.statics.findByManagerId = async function (
  managerId: string
): Promise<NodeDoc> {
  const node = await this.findOne({ managers: { $in: [managerId] } }).exec();
  return node;
};

export const Node = mongoose.model("Node", nodeSchema);
