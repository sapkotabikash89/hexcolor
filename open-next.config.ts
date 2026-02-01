import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  default: {
    placement: "global",
  },
  buildCommand: "next build",
};

export default config;
