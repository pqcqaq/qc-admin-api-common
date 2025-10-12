import { SimpleResponseData } from ".";
import { http } from "./http";

// 系统监控数据类型定义
export interface SystemMonitor {
  id: string;
  cpuUsagePercent: number;
  cpuCores: number;
  memoryTotal: number;
  memoryUsed: number;
  memoryFree: number;
  memoryUsagePercent: number;
  diskTotal: number;
  diskUsed: number;
  diskFree: number;
  diskUsagePercent: number;
  networkBytesSent: number;
  networkBytesRecv: number;
  os: string;
  platform: string;
  platformVersion: string;
  hostname: string;
  goroutinesCount: number;
  heapAlloc: number;
  heapSys: number;
  gcCount: number;
  loadAvg1?: number;
  loadAvg5?: number;
  loadAvg15?: number;
  uptime: number;
  recordedAt: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SystemMonitorSummary {
  count: number;
  cpu: {
    avg: number;
    max: number;
    min: number;
  };
  memory: {
    avg: number;
    max: number;
    min: number;
  };
  disk: {
    avg: number;
    max: number;
    min: number;
  };
  period: {
    start: string;
    end: string;
    hours: number;
  };
}

export interface SystemMonitorHistoryParams {
  limit?: number;
  hours?: number;
}

export interface SystemMonitorRangeParams {
  start: string;
  end: string;
}

export interface SystemMonitorSummaryParams {
  hours?: number;
}

// API 接口
/**
 * 获取最新的系统状态
 */
export const getLatestSystemMonitor = () => {
  return http.request<SimpleResponseData<SystemMonitor>>(
    "get",
    "/api/system/monitor/latest"
  );
};

/**
 * 获取系统状态历史记录
 * @param params - 查询参数
 * @param params.limit - 返回的记录数量，默认 100
 * @param params.hours - 查询最近多少小时的数据，默认 1
 */
export const getSystemMonitorHistory = (
  params?: SystemMonitorHistoryParams
) => {
  return http.request<SimpleResponseData<SystemMonitor[]>>(
    "get",
    "/api/system/monitor/history",
    { params }
  );
};

/**
 * 根据时间范围获取系统状态
 * @param params - 查询参数
 * @param params.start - 开始时间 (ISO 8601 格式)
 * @param params.end - 结束时间 (ISO 8601 格式)
 */
export const getSystemMonitorByRange = (
  params: SystemMonitorRangeParams
) => {
  return http.request<SimpleResponseData<SystemMonitor[]>>(
    "get",
    "/api/system/monitor/range",
    { params }
  );
};

/**
 * 获取系统状态统计摘要
 * @param params - 查询参数
 * @param params.hours - 查询最近多少小时的数据，默认 24
 */
export const getSystemMonitorSummary = (
  params?: SystemMonitorSummaryParams
) => {
  return http.request<SimpleResponseData<SystemMonitorSummary>>(
    "get",
    "/api/system/monitor/summary",
    { params }
  );
};

/**
 * 删除系统监控记录
 * @param id - 记录ID
 */
export const deleteSystemMonitor = (id: string) => {
  return http.request<void>(
    "delete",
    `/api/system/monitor/${id}`
  );
};

/**
 * 根据时间范围删除系统监控记录
 * @param params - 查询参数
 * @param params.start - 开始时间 (ISO 8601 格式)
 * @param params.end - 结束时间 (ISO 8601 格式)
 */
export const deleteSystemMonitorByRange = (
  params: SystemMonitorRangeParams
) => {
  return http.request<SimpleResponseData<{ deleted: number }>>(
    "delete",
    "/api/system/monitor/range",
    { params }
  );
};
