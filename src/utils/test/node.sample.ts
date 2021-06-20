import { NodeDoc, NodeType } from "../../models/nodes";

interface NodeSampleRequest {
  office?: NodeType["nodeType"];
  name?: NodeType["name"];
  managers?: NodeType["managers"];
  employees?: NodeType["employees"];
  descendants?: NodeType["descendants"];
}

const nodeSample = (payload?: NodeSampleRequest): NodeType => ({
  _id: "someNodeId",
  name: payload?.name ?? "someNodeName",
  managers: payload?.managers ?? [],
  employees: payload?.employees ?? [],
  descendants: payload?.descendants ?? [],
  nodeType: payload?.office ?? "office",
});

export const sampleNodeDoc = (payload?: NodeSampleRequest): NodeDoc =>
  <NodeDoc>{
    ...nodeSample(payload),
    save: () => this,
  };
