import type { Pagination } from ".";
import { http } from "./http";

export type Area = {
  /** 地区ID */
  id: string;
  /** 地区名称 */
  name: string;
  /** 拼音首字母 */
  spell?: string;
  /** 层级类型 */
  level: "country" | "province" | "city" | "district" | "street";
  /** 深度 */
  depth: number;
  /** 地区编码 */
  code: string;
  /** 纬度 */
  latitude: number;
  /** 经度 */
  longitude: number;
  /** 父级ID */
  parentId?: string;
  /** 颜色 */
  color?: string;
  /** 父级地区 */
  parent?: Area;
  /** 子级地区 */
  children?: Array<Area>;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
};

export type CreateAreaRequest = {
  /** 地区名称 */
  name: string;
  /** 拼音首字母 */
  spell?: string;
  /** 层级类型 */
  level: "country" | "province" | "city" | "district" | "street";
  /** 深度 */
  depth: number;
  /** 地区编码 */
  code: string;
  /** 纬度 */
  latitude?: number;
  /** 经度 */
  longitude?: number;
  /** 父级ID */
  parentId?: string;
  /** 颜色 */
  color?: string;
};

export type UpdateAreaRequest = {
  /** 地区名称 */
  name?: string;
  /** 拼音首字母 */
  spell?: string;
  /** 层级类型 */
  level?: "country" | "province" | "city" | "district" | "street";
  /** 深度 */
  depth?: number;
  /** 地区编码 */
  code?: string;
  /** 纬度 */
  latitude?: number;
  /** 经度 */
  longitude?: number;
  /** 父级ID */
  parentId?: string;
  /** 颜色 */
  color?: string;
};

export type AreaResult = {
  success: boolean;
  data: Area;
  message?: string;
};

export type AreaListResult = {
  success: boolean;
  data: Array<Area>;
  pagination?: Pagination;
  count?: number;
};

export type GetAreasParams = {
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 排序方式 */
  order?: "asc" | "desc";
  /** 排序字段 */
  orderBy?: string;
  /** 地区名称 */
  name?: string;
  /** 层级类型 */
  level?: "country" | "province" | "city" | "district" | "street" | "";
  /** 深度 */
  depth?: number;
  /** 地区编码 */
  code?: string;
  /** 父级ID */
  parentId?: string;
};

/** 获取所有地区列表 */
export const getAreaList = () => {
  return http.get<AreaListResult, null>("/api/areas");
};

/** 获取地区分页列表 */
export const getAreaListWithPagination = (params?: GetAreasParams) => {
  return http.get<AreaListResult, GetAreasParams>("/api/areas/page", {
    params
  });
};

/** 获取单个地区 */
export const getArea = (id: string) => {
  return http.get<AreaResult, null>(`/api/areas/${id}`);
};

/** 创建地区 */
export const createArea = (data: CreateAreaRequest) => {
  return http.post<AreaResult, CreateAreaRequest>("/api/areas", {
    data
  });
};

/** 更新地区 */
export const updateArea = (id: string, data: UpdateAreaRequest) => {
  return http.put<AreaResult, UpdateAreaRequest>(`/api/areas/${id}`, {
    data
  });
};

/** 删除地区 */
export const deleteArea = (id: string) => {
  return http.delete<{ success: boolean; message: string }, null>(
    `/api/areas/${id}`
  );
};

/** 获取地区树形结构 */
export const getAreaTree = () => {
  return http.get<AreaListResult, null>("/api/areas/tree");
};

/** 根据父级ID获取下一级地区 */
export const getAreasByParentId = (parentId: string) => {
  return http.get<AreaListResult, { parentId: string }>(
    "/api/areas/children",
    {
      params: { parentId }
    }
  );
};

/** 根据层级类型获取地区 */
export const getAreasByLevel = (
  level: "country" | "province" | "city" | "district" | "street"
) => {
  return http.get<AreaListResult, { level: string }>("/api/areas/level", {
    params: { level }
  });
};

/** 根据深度获取地区 */
export const getAreasByDepth = (depth: number) => {
  return http.get<AreaListResult, { depth: number }>("/api/areas/depth", {
    params: { depth }
  });
};
