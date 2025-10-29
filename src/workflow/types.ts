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
  startNodeId: string;
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
}

export interface PageWorkflowNodeRequest extends PaginationRequest {
  name?: string;
  nodeKey?: string;
  type?: string;
  applicationId?: string;
  beginTime?: string;
  endTime?: string;
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

export interface WorkflowVersionResponse {
  id: string;
  createTime: string;
  updateTime: string;
  applicationId: string;
  version: number;
  snapshot: Record<string, any>;
  changeLog?: string;
  createdBy?: string;
}

export interface CreateWorkflowVersionRequest {
  applicationId: string;
  version: number;
  snapshot: Record<string, any>;
  changeLog?: string;
  createdBy?: string;
}

export interface PageWorkflowVersionRequest extends PaginationRequest {
  applicationId?: string;
  version?: number;
  beginTime?: string;
  endTime?: string;
}

export interface PageWorkflowVersionResponse {
  data: WorkflowVersionResponse[];
  pagination: Pagination;
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
