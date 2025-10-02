import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

// 定义所有子模块
const subModules = [
  'rbac',
  'auth', 
  'user',
  'menu',
  'route',
  'logging',
  'attachment',
  'client_devices',
  'api_auth'
];

// 生成主模块配置
const mainConfigs = [
  // 主要构建配置
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      })
    ],
    external: ['axios']
  },
  // 类型定义构建配置
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [dts()],
    external: ['axios']
  }
];

// 生成子模块配置
const subModuleConfigs = subModules.flatMap(moduleName => [
  // 子模块JS构建配置
  {
    input: `src/${moduleName}.ts`,
    output: [
      {
        file: `dist/${moduleName}.js`,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: `dist/${moduleName}.esm.js`,
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      })
    ],
    external: ['axios', './http']
  },
  // 子模块类型定义构建配置
  {
    input: `src/${moduleName}.ts`,
    output: {
      file: `dist/${moduleName}.d.ts`,
      format: 'es'
    },
    plugins: [dts()],
    external: ['axios', './http']
  }
]);

export default [...mainConfigs, ...subModuleConfigs];