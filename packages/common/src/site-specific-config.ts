export type HostConfig = {
  host: string;
  dev: boolean;
  questionnaires: string[];
};

const defaultConfig = {
  questionnaires: ["qchat", "cdc12", "cdc18", "cdc24"]
};

export const siteSpecificConfig: {
  [id: string]: { questionnaires: string[] };
} = {
  "watchmegrow.care": defaultConfig,
  "dubai.watchmegrow.care": defaultConfig,
  localhost: defaultConfig
};

function getSiteSpecificConfig(host: string): HostConfig {
  const indexOfDev = host.indexOf(".dev.");

  const baseConfig =
    indexOfDev >= 0
      ? {
          host: host.substring(0, indexOfDev) + host.substring(indexOfDev + 4),
          dev: true
        }
      : { host: host, dev: host === "localhost" };

  const extraConfig = siteSpecificConfig[baseConfig.host] || defaultConfig;

  return {
    ...baseConfig,
    ...extraConfig
  };
}

export default getSiteSpecificConfig;
