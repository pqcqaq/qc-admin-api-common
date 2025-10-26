import { getClientCode } from ".";
import { http } from "./http";

export type TokenInfo = {
  accessToken: string;
  refreshToken: string;
  accessExpiredIn: number;
  refreshExpiredIn: number;
};

export type UserResult = {
  success: boolean;
  data: {
    user: {
      /** 用户ID */
      id: string;
      /** 用户名 */
      name: string;
      /** 状态 */
      status: string;
      /** 创建时间 */
      createTime: string;
      /** 更新时间 */
      updateTime: string;
      /** 当前登录用户的角色 */
      roles: Array<any>;
      /** 按钮级别权限 */
      permissions: Array<any>;
      /** 头像 */
      avatar: string;
    };
    /** `token` */
    token: TokenInfo;
    /** 消息 */
    message: string;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    token: TokenInfo;
    /** 消息 */
    message: string;
  };
};

export type UserInfo = {
  /** 用户ID */
  id: string;
  /** 用户名 */
  name: string;
  /** 状态 */
  status: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
  /** 当前登录用户的角色 */
  roles: Array<any>;
  /** 按钮级别权限 */
  permissions: Array<any>;
  /** 头像 */
  avatar: string;
};

export type UserInfoResult = {
  success: boolean;
  data: UserInfo;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 登录 */
export const getLogin = (data: object) => {
  console.log("getLogin data:", data);
  return http.request<UserResult>("post", "/api/auth/login", {
    data: Object.assign(data, {
      clientCode: getClientCode()
    })
  });
};

export const refreshTokenApiEndpoint = "/api/auth/refresh-token";

/** 刷新`token` */
export const refreshTokenApi = (data: object) => {
  return http.request<RefreshTokenResult>("post", refreshTokenApiEndpoint, {
    data
  });
};

/** 注册 */
export const registerApi = (data: object) => {
  return http.request<any>("post", "/api/auth/register", {
    data: Object.assign(data, {
      clientCode: getClientCode()
    })
  });
};

/** 发送验证码 */
export const sendVerifyCodeApi = (data: object) => {
  return http.request<any>("post", "/api/auth/send-verify-code", {
    data: Object.assign(data, {
      clientCode: getClientCode()
    })
  });
};

/** 验证验证码 */
export const verifyCodeApi = (data: object) => {
  return http.request<any>("post", "/api/auth/verify-code", {
    data: Object.assign(data, {
      clientCode: getClientCode()
    })
  });
};

/** 重置密码 */
export const resetPasswordApi = (data: object) => {
  return http.request<any>("post", "/api/auth/reset-password", {
    data: Object.assign(data, {
      clientCode: getClientCode()
    })
  });
};

/** 获取用户信息 */
export const getUserInfoApi = (data: object) => {
  return http.request<UserInfoResult>("get", "/api/auth/user-info", {
    data
  });
};

/** 账户设置-个人信息 */
export const getMine = (data: object) => {
  return http.request<UserInfoResult>("get", "/mine", {
    data
  });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (data: object) => {
  return http.request<ResultTable>("get", "/mine-logs", { data });
};
