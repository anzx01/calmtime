/** 持久化 schema 版本（迁移用）。 */
export const SCHEMA_VERSION = 1;

const PREFIX = `calmtime:v${SCHEMA_VERSION}`;

/** localStorage key（带版本前缀，便于未来迁移）。 */
export const STORAGE_KEYS = {
  settings: `${PREFIX}:settings`,
  tasks: `${PREFIX}:tasks`,
  templates: `${PREFIX}:templates`,
  sessions: `${PREFIX}:sessions`,
  timer: `${PREFIX}:timer`,
  sync: `${PREFIX}:sync`,
  i18n: `${PREFIX}:i18n`,
} as const;
