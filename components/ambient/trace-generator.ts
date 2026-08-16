export type TraceLevel = 'ok' | 'retry' | 'fail';

export interface TraceLine {
  id: string;
  timestamp: string;
  component: string;
  message: string;
  level: TraceLevel;
}

const COMPONENTS = [
  'RCA agent',
  'Temporal',
  'Backstage',
  'LangGraph',
  'Google ADK',
  'Vault',
  'Jenkins',
];

const ACTIONS = [
  { msg: 'run 0x{HEX} started', level: 'ok' as const },
  { msg: 'workflow "{ID}" queued', level: 'ok' as const },
  { msg: 'template "{ID}" scaffolded', level: 'ok' as const },
  { msg: 'node "{ID}" complete ({N}ms)', level: 'ok' as const },
  { msg: 'tool "{ID}" invoked', level: 'ok' as const },
  { msg: 'rate-limited, retrying', level: 'retry' as const },
  { msg: 'DLQ check passed', level: 'ok' as const },
  { msg: 'workflow "{ID}" failed', level: 'fail' as const },
];

const ID = (n: number) => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
const NUM = () => Math.floor(Math.random() * 900) + 100;

export function generateTraceLine(): TraceLine {
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const component = COMPONENTS[Math.floor(Math.random() * COMPONENTS.length)];
  const t = new Date();
  const timestamp = `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
  const message = action.msg
    .replace('{HEX}', ID(Math.random() * 0xffff))
    .replace('{ID}', component.toLowerCase().replace(/\s+/g, '-') + '-' + ID(Math.random() * 0xffff))
    .replace('{N}', String(NUM()));
  return {
    id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp,
    component,
    message,
    level: action.level,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}