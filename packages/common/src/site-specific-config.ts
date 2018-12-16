export type HostConfig = {
  host: string;
  dev: boolean;
  questionnaires: string[];
};

export const siteSpecificConfig: {
  [id: string]: { questionnaires: string[] };
} = {
  "watchmegrow.care": {
    questionnaires: ["qchat", "cdc12", "cdc18", "cdc24"]
  },
  "dubai.watchmegrow.care": {
    questionnaires: ["qchat", "cdc12", "cdc18", "cdc24"]
  },
  localhost: {
    questionnaires: ["qchat", "cdc12", "cdc18", "cdc24"]
  }
};

function getSiteSpecificConfig(host: string): HostConfig {
  const indexOfDev = host.indexOf(".dev.");

  const config =
    indexOfDev >= 0
      ? {
          host: host.substring(0, indexOfDev) + host.substring(indexOfDev + 4),
          dev: true
        }
      : { host: host, dev: host === "localhost" };

  return {
    ...config,
    questionnaires: siteSpecificConfig[config.host].questionnaires
  };
}

export default getSiteSpecificConfig;
