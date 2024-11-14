import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/deliver',
    },
    {
      name: '配送设置',
      path: '/deliver',
      component: './Deliver',
    },
  ],
  npmClient: 'npm',
});
