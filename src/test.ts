import { http } from "./http";

/** 测试发送userSocket消息 */
export const sendUserSocketMsg = (
) => {
  return http.request<any>("get", `/api/test/send-user-socket-msg`);
};