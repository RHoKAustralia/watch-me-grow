export type HostConfig = {
  id: string;
  title: string;
  host: string;
  questionnaires: string[];
  language: string;
};

const REPLACE_LOCALHOST_WITH = "watchmegrow.care";
const DEFAULT_QUESTIONNAIRES = [
  "cdc6",
  "cdc9",
  "cdc12",
  "cdc18",
  "cdc24",
  "cdc36",
  "cdc48",
  "cdc60",
  "qchat",
  "pdq1",
  "asq10"
];

export const sites: HostConfig[] = [
  {
    id: "main",
    title: "Main",
    host: "watchmegrow.care",
    questionnaires: DEFAULT_QUESTIONNAIRES,
    language: "en"
  },
  {
    id: "dubai",
    title: "Dubai",
    host: "dubai.watchmegrow.care",
    questionnaires: DEFAULT_QUESTIONNAIRES,
    language: "en"
  },
  {
    id: "preschool",
    title: "Preschool",
    host: "preschool.watchmegrow.care",
    questionnaires: DEFAULT_QUESTIONNAIRES,
    language: "en"
  },
  {
    id: "wmg-e",
    title: "WMG - E",
    host: "wmg-e.watchmegrow.care",
    questionnaires: DEFAULT_QUESTIONNAIRES,
    language: "en"
  },
  {
    id: "wmg-real",
    title: "WMG - REAL",
    host: "wmg-real.watchmegrow.care",
    questionnaires: DEFAULT_QUESTIONNAIRES,
    language: "en"
  },
  {
    id: "childcare-rockdale",
    title: "Childcare - Rockdale",
    host: "childcare-rockdale.watchmegrow.care",
    questionnaires: DEFAULT_QUESTIONNAIRES,
    language: "en"
  },
  {
    id: "gp-rockdale",
    title: "GP - Rockdale",
    host: "gp-rockdale.watchmegrow.care",
    questionnaires: DEFAULT_QUESTIONNAIRES,
    language: "en"
  },
  {
    id: "playgroup-botany",
    title: "Playgroup - Botany",
    host: "playgroup-botany.watchmegrow.care",
    questionnaires: DEFAULT_QUESTIONNAIRES,
    language: "en"
  },
  {
    id: "indonesia",
    title: "Indonesia",
    host: "indonesia.watchmegrow.care",
    questionnaires: DEFAULT_QUESTIONNAIRES,
    language: "id"
  }
];

export function getConfigByHost(host: string): HostConfig | undefined {
  const indexOfDev = host.indexOf("dev.");

  const fixedHost = (() => {
    if (indexOfDev >= 0) {
      return host.substring(0, indexOfDev) + host.substring(indexOfDev + 4);
    } else if (host === "localhost") {
      return REPLACE_LOCALHOST_WITH;
    } else {
      return host;
    }
  })();

  const extraConfig = sites.find(site => site.host === fixedHost);

  if (extraConfig) {
    return {
      host: fixedHost,
      ...extraConfig
    };
  }
}

export function getConfigById(id: string) {
  const config = sites.find(site => site.id === id);

  if (config) {
    return config;
  } else {
    throw new Error("Could not find config for id " + id);
  }
}
