# QC Admin API Common

QC Admin系统的公共API接口库，提供统一的类型定义和API调用方法。

## 安装

```bash
npm install qc-admin-api-common
# 或
pnpm add qc-admin-api-common
```

## 使用方法

### 基础用法

```typescript
import { createAPIClient, QCAdminAPIClient } from 'qc-admin-api-common';
import axios from 'axios';

// 创建HTTP客户端
const httpClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// 创建API客户端
const apiClient = createAPIClient(httpClient);

// 使用API
async function login() {
  const result = await apiClient.auth.login({
    username: 'admin',
    password: 'password123'
  });
  console.log(result);
}
```

### 类型导入

```typescript
import type { 
  User, 
  UserResult, 
  TokenInfo, 
  Attachment,
  Pagination 
} from 'qc-admin-api-common';
```

## API模块

### 认证模块 (AuthAPI)

- `login(data)` - 用户登录
- `logout()` - 用户登出
- `refreshToken(refreshToken)` - 刷新Token
- `getCurrentUser()` - 获取当前用户信息
- `changePassword(data)` - 修改密码
- `resetPassword(data)` - 重置密码
- `sendCaptcha(data)` - 发送验证码
- `validateToken(token)` - 验证Token有效性

### 用户管理模块 (UserAPI)

- `getUserList(params)` - 获取用户列表
- `getUserById(id)` - 获取用户详情
- `createUser(data)` - 创建用户
- `updateUser(id, data)` - 更新用户信息
- `deleteUser(id)` - 删除用户
- `batchDeleteUsers(ids)` - 批量删除用户
- `updateUserStatus(id, status)` - 更新用户状态
- `resetUserPassword(id, newPassword)` - 重置用户密码
- `updateUserAvatar(id, avatarId)` - 更新用户头像
- `getUserRoles(id)` - 获取用户角色
- `assignUserRoles(id, roleIds)` - 分配用户角色
- `checkUsername(username)` - 检查用户名是否可用
- `checkEmail(email)` - 检查邮箱是否可用
- `checkPhone(phone)` - 检查手机号是否可用

### 附件管理模块 (AttachmentAPI)

- `getAttachmentList(params)` - 获取附件列表
- `getAttachmentById(id)` - 获取附件详情
- `uploadFile(file, options)` - 上传文件
- `uploadMultipleFiles(files, options)` - 批量上传文件
- `deleteAttachment(id)` - 删除附件
- `batchDeleteAttachments(ids)` - 批量删除附件
- `updateAttachment(id, data)` - 更新附件信息
- `getDownloadUrl(id)` - 获取附件下载链接
- `downloadAttachment(id)` - 下载附件
- `getPreviewUrl(id)` - 获取附件预览链接
- `searchByTags(tags, params)` - 根据标签搜索附件
- `getStorageStats()` - 获取存储统计信息

## 主要类型

### 用户相关
- `User` - 用户信息
- `UserResult` - 用户操作结果
- `UserListResult` - 用户列表结果
- `UserInfo` - 当前用户信息

### 认证相关
- `TokenInfo` - Token信息
- `RefreshTokenResult` - 刷新Token结果

### 附件相关
- `Attachment` - 附件信息
- `AttachmentResult` - 附件操作结果
- `AttachmentListResult` - 附件列表结果
- `UploadResult` - 上传结果

### 基础类型
- `IBaseResponse<T>` - 基础响应类型
- `Pagination` - 分页信息
- `IPaginationParams` - 分页参数
- `IPaginationResponse<T>` - 分页响应

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm run build

# 监听模式构建
pnpm run dev
```

## 许可证

MIT