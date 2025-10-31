// ============ Common Types ============

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationRequest {
  page?: number;
  pageSize?: number;
}

// ============ WorkflowApplication Types ============

export interface WorkflowApplicationResponse {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
  description?: string;
  startNodeId: string;
  clientSecret: string;
  variables?: Record<string, any>;
  version: number;
  status: 'draft' | 'published' | 'archived';
  nodes?: WorkflowNodeResponse[];
}

export interface CreateWorkflowApplicationRequest {
  name: string;
  description?: string;
  startNodeId?: string; // 可选，如果不提供则后端自动创建默认开始节点
  variables?: Record<string, any>;
  status?: 'draft' | 'published' | 'archived';
}

export interface UpdateWorkflowApplicationRequest {
  name: string;
  description?: string;
  startNodeId: string;
  variables?: Record<string, any>;
  version?: number;
  status?: 'draft' | 'published' | 'archived';
}

export interface PageWorkflowApplicationRequest extends PaginationRequest {
  name?: string;
  status?: string;
  beginTime?: string;
  endTime?: string;
}

export interface PageWorkflowApplicationResponse {
  data: WorkflowApplicationResponse[];
  pagination: Pagination;
}

// ============ WorkflowNode Types ============

export type WorkflowNodeType =
  | 'user_input'
  | 'todo_task_generator'
  | 'condition_checker'
  | 'api_caller'
  | 'data_processor'
  | 'while_loop'
  | 'end_node'
  | 'parallel_executor'
  | 'llm_caller';

export interface WorkflowNodeResponse {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
  nodeKey: string;
  type: WorkflowNodeType;
  description?: string;
  prompt?: string;
  config: Record<string, any>;
  applicationId: string;
  processorLanguage?: string;
  processorCode?: string;
  nextNodeId?: string;
  parentNodeId?: string;
  branchNodes?: Record<string, number>;
  parallelConfig?: Record<string, any>;
  apiConfig?: Record<string, any>;
  async: boolean;
  timeout: number;
  retryCount: number;
  positionX: number;
  positionY: number;
  color?: string;
}

export interface CreateWorkflowNodeRequest {
  name: string;
  nodeKey: string;
  type: WorkflowNodeType;
  description?: string;
  prompt?: string;
  config: Record<string, any>;
  applicationId: string;
  processorLanguage?: string;
  processorCode?: string;
  nextNodeId?: string;
  parentNodeId?: string;
  branchNodes?: Record<string, number>;
  parallelConfig?: Record<string, any>;
  apiConfig?: Record<string, any>;
  async?: boolean;
  timeout?: number;
  retryCount?: number;
  positionX?: number;
  positionY?: number;
  color?: string;
}

export interface UpdateWorkflowNodeRequest {
  name: string;
  nodeKey: string;
  type: WorkflowNodeType;
  description?: string;
  prompt?: string;
  config: Record<string, any>;
  processorLanguage?: string;
  processorCode?: string;
  nextNodeId?: string;
  parentNodeId?: string;
  branchNodes?: Record<string, number>;
  parallelConfig?: Record<string, any>;
  apiConfig?: Record<string, any>;
  async?: boolean;
  timeout?: number;
  retryCount?: number;
  positionX?: number;
  positionY?: number;
  color?: string;
}

export interface PageWorkflowNodeRequest extends PaginationRequest {
  name?: string;
  nodeKey?: string;
  type?: string;
  applicationId?: string;
  beginTime?: string;
  endTime?: string;
}

// ============ WorkflowEdge Types ============

export type WorkflowEdgeType = 'default' | 'branch' | 'parallel';

export interface WorkflowEdgeResponse {
  id: string;
  createTime: string;
  updateTime: string;
  edgeKey: string;
  applicationId: string;
  source: string; // Vue Flow uses "source"
  target: string; // Vue Flow uses "target"
  sourceHandle?: string;
  targetHandle?: string;
  type: WorkflowEdgeType;
  label?: string;
  branchName?: string;
  animated: boolean;
  style?: Record<string, any>;
  data?: Record<string, any>;
}

export interface CreateWorkflowEdgeRequest {
  edgeKey: string;
  applicationId: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: WorkflowEdgeType;
  label?: string;
  branchName?: string;
  animated?: boolean;
  style?: Record<string, any>;
  data?: Record<string, any>;
}

export interface UpdateWorkflowEdgeRequest {
  edgeKey?: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: WorkflowEdgeType;
  label?: string;
  branchName?: string;
  animated?: boolean;
  style?: Record<string, any>;
  data?: Record<string, any>;
}

export interface PageWorkflowEdgeRequest extends PaginationRequest {
  applicationId?: string;
  sourceNodeId?: string;
  targetNodeId?: string;
  type?: string;
  beginTime?: string;
  endTime?: string;
}

export interface PageWorkflowEdgeResponse {
  data: WorkflowEdgeResponse[];
  pagination: Pagination;
}

export interface BatchCreateWorkflowEdgesRequest {
  edges: CreateWorkflowEdgeRequest[];
}

export interface BatchDeleteWorkflowEdgesRequest {
  edgeIds: string[];
}

export interface PageWorkflowNodeResponse {
  data: WorkflowNodeResponse[];
  pagination: Pagination;
}

// ============ WorkflowExecution Types ============

export type WorkflowExecutionStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timeout';

export interface WorkflowExecutionResponse {
  id: string;
  createTime: string;
  updateTime: string;
  executionId: string;
  applicationId: string;
  status: WorkflowExecutionStatus;
  input?: Record<string, any>;
  output?: Record<string, any>;
  context?: Record<string, any>;
  startedAt?: string;
  finishedAt?: string;
  durationMs: number;
  totalTokens: number;
  totalCost: number;
  errorMessage?: string;
  errorStack?: string;
  triggeredBy?: string;
  triggerSource?: string;
  nodeExecutions?: WorkflowNodeExecutionResponse[];
}

export interface CreateWorkflowExecutionRequest {
  applicationId: string;
  input?: Record<string, any>;
  context?: Record<string, any>;
  triggeredBy?: string;
  triggerSource?: string;
}

export interface UpdateWorkflowExecutionRequest {
  status?: WorkflowExecutionStatus;
  output?: Record<string, any>;
  context?: Record<string, any>;
  errorMessage?: string;
  errorStack?: string;
}

export interface PageWorkflowExecutionRequest extends PaginationRequest {
  executionId?: string;
  applicationId?: string;
  status?: string;
  triggeredBy?: string;
  beginTime?: string;
  endTime?: string;
}

export interface PageWorkflowExecutionResponse {
  data: WorkflowExecutionResponse[];
  pagination: Pagination;
}

// ============ WorkflowNodeExecution Types ============

export type WorkflowNodeExecutionStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'timeout';

export interface WorkflowNodeExecutionResponse {
  id: string;
  createTime: string;
  updateTime: string;
  executionId: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: WorkflowNodeExecutionStatus;
  input?: Record<string, any>;
  output?: Record<string, any>;
  extra?: Record<string, any>;
  startedAt?: string;
  finishedAt?: string;
  durationMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  model?: string;
  errorMessage?: string;
  errorStack?: string;
  retryCount: number;
  isAsync: boolean;
  parentExecutionId?: string;
}

export interface CreateWorkflowNodeExecutionRequest {
  executionId: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  input?: Record<string, any>;
  isAsync?: boolean;
  parentExecutionId?: string;
}

export interface UpdateWorkflowNodeExecutionRequest {
  status?: WorkflowNodeExecutionStatus;
  output?: Record<string, any>;
  extra?: Record<string, any>;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  cost?: number;
  model?: string;
  errorMessage?: string;
  errorStack?: string;
  retryCount?: number;
}

export interface PageWorkflowNodeExecutionRequest extends PaginationRequest {
  executionId?: string;
  nodeId?: string;
  nodeType?: string;
  status?: string;
  parentExecutionId?: string;
  beginTime?: string;
  endTime?: string;
}

export interface PageWorkflowNodeExecutionResponse {
  data: WorkflowNodeExecutionResponse[];
  pagination: Pagination;
}

// ============ WorkflowVersion Types ============

/** 版本快照数据结构 */
export interface WorkflowVersionSnapshot {
  nodes: WorkflowNodeResponse[];
  edges: WorkflowEdgeResponse[];
}

/** 版本响应 */
export interface WorkflowVersionResponse {
  id: string;
  createTime: string;
  updateTime: string;
  applicationId: string;
  version: number;
  snapshot: WorkflowVersionSnapshot;
  changeLog?: string;
}

/** 创建版本请求 */
export interface CreateWorkflowVersionRequest {
  applicationId: string;
  changeLog?: string;
}

/** 版本结果 */
export interface WorkflowVersionResult {
  success: boolean;
  data: WorkflowVersionResponse;
  message?: string;
}

/** 版本列表响应 */
export interface WorkflowVersionListResult {
  success: boolean;
  data: WorkflowVersionResponse[];
  count?: number;
}

// ============ WorkflowExecutionLog Types ============

export type WorkflowExecutionLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface WorkflowExecutionLogResponse {
  id: string;
  createTime: string;
  updateTime: string;
  executionId: string;
  nodeExecutionId?: string;
  level: WorkflowExecutionLogLevel;
  message: string;
  metadata?: Record<string, any>;
  loggedAt: string;
}

export interface CreateWorkflowExecutionLogRequest {
  executionId: string;
  nodeExecutionId?: string;
  level: WorkflowExecutionLogLevel;
  message: string;
  metadata?: Record<string, any>;
}

export interface PageWorkflowExecutionLogRequest extends PaginationRequest {
  executionId?: string;
  nodeExecutionId?: string;
  level?: string;
  beginTime?: string;
  endTime?: string;
}

export interface PageWorkflowExecutionLogResponse {
  data: WorkflowExecutionLogResponse[];
  pagination: Pagination;
}

// ============ Graph Operations Types ============

/** 连接节点请求 */
export interface ConnectNodesRequest {
  fromNodeId: string;
  toNodeId: string;
}

/** 断开节点请求 */
export interface DisconnectNodesRequest {
  fromNodeId: string;
}

/** 分支连接请求 */
export interface ConnectBranchRequest {
  fromNodeId: string;
  toNodeId: string;
  branchName: string;
}

/** 断开分支请求 */
export interface DisconnectBranchRequest {
  fromNodeId: string;
  branchName: string;
}

/** 添加节点到并行执行请求 */
export interface AddNodeToParallelRequest {
  parallelNodeId: string;
  childNodeId: string;
}

/** 从并行执行中移除节点请求 */
export interface RemoveNodeFromParallelRequest {
  childNodeId: string;
}

/** 更新节点位置请求 */
export interface UpdateNodePositionRequest {
  nodeId: string;
  positionX: number;
  positionY: number;
}

/** 批量更新节点位置请求 */
export interface BatchUpdateNodePositionsRequest {
  positions: Array<{
    nodeId: string;
    positionX: number;
    positionY: number;
  }>;
}

/** 批量删除节点请求 */
export interface BatchDeleteNodesRequest {
  nodeIds: string[];
}

/** 节点连接信息响应 */
export interface NodeConnectionsResponse {
  success: boolean;
  data: {
    next_node_id?: string;
    parent_node_id?: string;
    branches?: Record<string, string>;
    parallel_children?: string[];
  };
}

/** 并行子节点列表响应 */
export interface ParallelChildrenResponse {
  success: boolean;
  data: WorkflowNodeResponse[];
  count: number;
}

/** 通用成功响应 */
export interface SuccessResponse {
  success: boolean;
  message: string;
}

/** 单个应用响应 */
export interface WorkflowApplicationResult {
  success: boolean;
  data: WorkflowApplicationResponse;
  message?: string;
}

/** 应用列表响应 */
export interface WorkflowApplicationListResult {
  success: boolean;
  data: WorkflowApplicationResponse[];
  pagination?: Pagination;
  count?: number;
}

/** 单个节点响应 */
export interface WorkflowNodeResult {
  success: boolean;
  data: WorkflowNodeResponse;
  message?: string;
}

/** 节点列表响应 */
export interface WorkflowNodeListResult {
  success: boolean;
  data: WorkflowNodeResponse[];
  pagination?: Pagination;
  count?: number;
}

/** 单个边响应 */
export interface WorkflowEdgeResult {
  success: boolean;
  data: WorkflowEdgeResponse;
  message?: string;
}

/** 边列表响应 */
export interface WorkflowEdgeListResult {
  success: boolean;
  data: WorkflowEdgeResponse[];
  pagination?: Pagination;
  count?: number;
}
