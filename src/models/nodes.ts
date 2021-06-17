import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const awailableNodeTypes = ["office", "store"];

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
  findByUserId: (id: string) => Promise<NodeDoc>;
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
      enum: awailableNodeTypes,
      default: "office",
    },
  },
  {
    _id: false,
    versionKey: false,
    collection: "grocery_nodes",
    toJSON: {
      transform(_doc, ret) {
        delete ret.descendants;
      },
    },
  }
);

nodeSchema.statics.findByUserId = async function (
  userId: string
): Promise<NodeDoc> {
  const node = await this.findOne({
    $or: [{ employees: userId }, { managers: userId }],
  });
  return node;
};

export const Node = mongoose.model("Node", nodeSchema);
