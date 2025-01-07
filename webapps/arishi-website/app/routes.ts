import { type RouteConfig, index, route, layout } from '@react-router/dev/routes';

export default [
  layout('./layouts/root-layout.tsx', [
    layout('./layouts/resume-layout.tsx', [index('./routes/home.tsx')]),
    route('json-formatter', './routes/json-formatter.tsx'),
  ]),
] satisfies RouteConfig;
