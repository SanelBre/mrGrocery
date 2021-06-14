import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface NodeType {
    _id?: string;
    name: string;
    managers: string[];
    employees: string[];
    descendants?: string[];
    nodeType?: "office" | "store";
}

type NodeDoc = NodeType & mongoose.Document

interface NodeModel extends mongoose.Model<NodeDoc> {}

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
        default: "office"
    }
  },
  {
    _id: false,
    versionKey: false,
    collection: 'grocery_nodes'
  }
);

export const Node = mongoose.model("Node", nodeSchema);
