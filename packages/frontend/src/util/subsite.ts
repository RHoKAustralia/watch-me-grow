import getSiteSpecificConfig, {
  HostConfig
} from "@wmg/common/lib/site-specific-config";

const host = window.location.hostname;
const config: HostConfig = getSiteSpecificConfig(host);

export default config;
