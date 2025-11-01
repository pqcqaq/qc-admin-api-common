import { http } from "../http";
export * from "./types";
import type {
  WorkflowApplicationResult,
  WorkflowApplicationListResult,
  CreateWorkflowApplicationRequest,
  UpdateWorkflowApplicationRequest,
  PageWorkflowApplicationRequest,
  WorkflowNodeResult,
  WorkflowNodeListResult,
  CreateWorkflowNodeRequest,
  UpdateWorkflowNodeRequest,
  PageWorkflowNodeRequest,
  WorkflowEdgeResult,
  WorkflowEdgeListResult,
  CreateWorkflowEdgeRequest,
  UpdateWorkflowEdgeRequest,
  PageWorkflowEdgeRequest,
  BatchCreateWorkflowEdgesRequest,
  BatchDeleteWorkflowEdgesRequest,
  BatchSaveWorkflowRequest,
  BatchSaveWorkflowResponse,
  WorkflowVersionResult,
  WorkflowVersionListResult,
  CreateWorkflowVersionRequest,
  ConnectNodesRequest,
  DisconnectNodesRequest,
  ConnectBranchRequest,
  DisconnectBranchRequest,
  AddNodeToParallelRequest,
  RemoveNodeFromParallelRequest,
  UpdateNodePositionRequest,
  BatchUpdateNodePositionsRequest,
  BatchDeleteNodesRequest,
  NodeConnectionsResponse,
  ParallelChildrenResponse,
  SuccessResponse
} from "./types";

// ============ WorkflowApplication APIs ============

/** 获取所有工作流应用列表 */
export const getWorkflowApplicationList = () => {
  return http.get<WorkflowApplicationListResult, null>(
    "/api/workflow/applications"
  );
};

/** 获取工作流应用分页列表 */
export const getWorkflowApplicationListWithPagination = (
  params?: PageWorkflowApplicationRequest
) => {
  return http.get<WorkflowApplicationListResult, PageWorkflowApplicationRequest>(
    "/api/workflow/applications/page",
    { params }
  );
};

/** 获取单个工作流应用 */
export const getWorkflowApplication = (id: string) => {
  return http.get<WorkflowApplicationResult, null>(
    `/api/workflow/applications/${id}`
  );
};

/** 创建工作流应用 */
export const createWorkflowApplication = (
  data: CreateWorkflowApplicationRequest
) => {
  return http.post<WorkflowApplicationResult, CreateWorkflowApplicationRequest>(
    "/api/workflow/applications",
    { data }
  );
};

/** 更新工作流应用 */
export const updateWorkflowApplication = (
  id: string,
  data: UpdateWorkflowApplicationRequest
) => {
  return http.put<WorkflowApplicationResult, UpdateWorkflowApplicationRequest>(
    `/api/workflow/applications/${id}`,
    { data }
  );
};

/** 删除工作流应用 */
export const deleteWorkflowApplication = (id: string) => {
  return http.delete<SuccessResponse, null>(
    `/api/workflow/applications/${id}`
  );
};

/** 克隆工作流应用 */
export const cloneWorkflowApplication = (id: string) => {
  return http.post<WorkflowApplicationResult, null>(
    `/api/workflow/applications/${id}/clone`
  );
};

// ============ WorkflowNode APIs ============

/** 获取所有工作流节点列表 */
export const getWorkflowNodeList = () => {
  return http.get<WorkflowNodeListResult, null>("/api/workflow/nodes");
};

/** 根据应用ID获取工作流节点列表 */
export const getWorkflowNodesByApplicationId = (applicationId: string) => {
  return http.get<WorkflowNodeListResult, { applicationId: string }>(
    "/api/workflow/nodes/by-application",
    { params: { applicationId } }
  );
};

/** 获取工作流节点分页列表 */
export const getWorkflowNodeListWithPagination = (
  params?: PageWorkflowNodeRequest
) => {
  return http.get<WorkflowNodeListResult, PageWorkflowNodeRequest>(
    "/api/workflow/nodes/page",
    { params }
  );
};

/** 获取单个工作流节点 */
export const getWorkflowNode = (id: string) => {
  return http.get<WorkflowNodeResult, null>(`/api/workflow/nodes/${id}`);
};

/** 创建工作流节点 */
export const createWorkflowNode = (data: CreateWorkflowNodeRequest) => {
  return http.post<WorkflowNodeResult, CreateWorkflowNodeRequest>(
    "/api/workflow/nodes",
    { data }
  );
};

/** 更新工作流节点 */
export const updateWorkflowNode = (
  id: string,
  data: UpdateWorkflowNodeRequest
) => {
  return http.put<WorkflowNodeResult, UpdateWorkflowNodeRequest>(
    `/api/workflow/nodes/${id}`,
    { data }
  );
};

/** 删除工作流节点 */
export const deleteWorkflowNode = (id: string) => {
  return http.delete<SuccessResponse, null>(`/api/workflow/nodes/${id}`);
};

// ============ Graph Operations APIs ============

/** 连接两个节点（普通next_node_id连接） */
export const connectNodes = (data: ConnectNodesRequest) => {
  return http.post<SuccessResponse, ConnectNodesRequest>(
    "/api/workflow/graph/connect",
    { data }
  );
};

/** 断开节点的next_node_id连接 */
export const disconnectNodes = (data: DisconnectNodesRequest) => {
  return http.post<SuccessResponse, DisconnectNodesRequest>(
    "/api/workflow/graph/disconnect",
    { data }
  );
};

/** 为分支节点添加分支连接 */
export const connectBranch = (data: ConnectBranchRequest) => {
  return http.post<SuccessResponse, ConnectBranchRequest>(
    "/api/workflow/graph/connect-branch",
    { data }
  );
};

/** 删除分支节点的某个分支连接 */
export const disconnectBranch = (data: DisconnectBranchRequest) => {
  return http.post<SuccessResponse, DisconnectBranchRequest>(
    "/api/workflow/graph/disconnect-branch",
    { data }
  );
};

/** 将节点添加到并行执行节点 */
export const addNodeToParallel = (data: AddNodeToParallelRequest) => {
  return http.post<SuccessResponse, AddNodeToParallelRequest>(
    "/api/workflow/graph/add-to-parallel",
    { data }
  );
};

/** 从并行执行节点中移除子节点 */
export const removeNodeFromParallel = (data: RemoveNodeFromParallelRequest) => {
  return http.post<SuccessResponse, RemoveNodeFromParallelRequest>(
    "/api/workflow/graph/remove-from-parallel",
    { data }
  );
};

/** 获取并行节点的所有子节点 */
export const getParallelChildren = (parallelNodeId: string) => {
  return http.get<ParallelChildrenResponse, { parallelNodeId: string }>(
    "/api/workflow/graph/parallel-children",
    { params: { parallelNodeId } }
  );
};

/** 获取节点的所有连接信息 */
export const getNodeConnections = (nodeId: string) => {
  return http.get<NodeConnectionsResponse, { nodeId: string }>(
    "/api/workflow/graph/connections",
    { params: { nodeId } }
  );
};

/** 更新节点位置 */
export const updateNodePosition = (data: UpdateNodePositionRequest) => {
  return http.put<SuccessResponse, UpdateNodePositionRequest>(
    "/api/workflow/graph/position",
    { data }
  );
};

/** 批量更新节点位置 */
export const batchUpdateNodePositions = (
  data: BatchUpdateNodePositionsRequest
) => {
  return http.put<SuccessResponse, BatchUpdateNodePositionsRequest>(
    "/api/workflow/graph/positions",
    { data }
  );
};

/** 批量删除节点 */
export const batchDeleteNodes = (data: BatchDeleteNodesRequest) => {
  return http.post<SuccessResponse, BatchDeleteNodesRequest>(
    "/api/workflow/graph/batch-delete",
    { data }
  );
};

// ============ WorkflowEdge APIs ============

/** 获取所有工作流边列表 */
export const getWorkflowEdgeList = () => {
  return http.get<WorkflowEdgeListResult, null>("/api/workflow/edges");
};

/** 根据应用ID获取工作流边列表 */
export const getWorkflowEdgesByApplicationId = (applicationId: string) => {
  return http.get<WorkflowEdgeListResult, { applicationId: string }>(
    "/api/workflow/edges/by-application",
    { params: { applicationId } }
  );
};

/** 获取工作流边分页列表 */
export const getWorkflowEdgeListWithPagination = (
  params?: PageWorkflowEdgeRequest
) => {
  return http.get<WorkflowEdgeListResult, PageWorkflowEdgeRequest>(
    "/api/workflow/edges/page",
    { params }
  );
};

/** 获取单个工作流边 */
export const getWorkflowEdge = (id: string) => {
  return http.get<WorkflowEdgeResult, null>(`/api/workflow/edges/${id}`);
};

/** 创建工作流边 */
export const createWorkflowEdge = (data: CreateWorkflowEdgeRequest) => {
  return http.post<WorkflowEdgeResult, CreateWorkflowEdgeRequest>(
    "/api/workflow/edges",
    { data }
  );
};

/** 更新工作流边 */
export const updateWorkflowEdge = (
  id: string,
  data: UpdateWorkflowEdgeRequest
) => {
  return http.put<WorkflowEdgeResult, UpdateWorkflowEdgeRequest>(
    `/api/workflow/edges/${id}`,
    { data }
  );
};

/** 删除工作流边 */
export const deleteWorkflowEdge = (id: string) => {
  return http.delete<SuccessResponse, null>(`/api/workflow/edges/${id}`);
};

/** 批量创建工作流边 */
export const batchCreateWorkflowEdges = (
  data: BatchCreateWorkflowEdgesRequest
) => {
  return http.post<WorkflowEdgeListResult, BatchCreateWorkflowEdgesRequest>(
    "/api/workflow/edges/batch-create",
    { data }
  );
};

/** 批量删除工作流边 */
export const batchDeleteWorkflowEdges = (
  data: BatchDeleteWorkflowEdgesRequest
) => {
  return http.post<SuccessResponse, BatchDeleteWorkflowEdgesRequest>(
    "/api/workflow/edges/batch-delete",
    { data }
  );
};

// ============ Batch Save API ============

/** 批量保存工作流（节点和边的增删改） */
export const batchSaveWorkflow = (data: BatchSaveWorkflowRequest) => {
  return http.post<BatchSaveWorkflowResponse, BatchSaveWorkflowRequest>(
    "/api/workflow/batch-save",
    { data }
  );
};

// ============ WorkflowVersion APIs ============

/** 创建工作流版本快照 */
export const createWorkflowVersion = (data: CreateWorkflowVersionRequest) => {
  return http.post<WorkflowVersionResult, CreateWorkflowVersionRequest>(
    "/api/workflow/versions",
    { data }
  );
};

/** 根据应用ID获取版本列表 */
export const getWorkflowVersionsByApplicationId = (applicationId: string) => {
  return http.get<WorkflowVersionListResult, null>(
    "/api/workflow/versions/by-application",
    { params: { applicationId } }
  );
};

/** 获取单个版本 */
export const getWorkflowVersion = (id: string) => {
  return http.get<WorkflowVersionResult, null>(
    `/api/workflow/versions/${id}`
  );
};
