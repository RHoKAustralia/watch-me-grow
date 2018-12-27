import {
  getConfigByHost,
  HostConfig
} from "@wmg/common/lib/site-specific-config";

const host = window.location.hostname;
const config: HostConfig = getConfigByHost(host);

export default config;
