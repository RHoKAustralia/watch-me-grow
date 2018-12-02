import { HostConfig } from "@wmg/common/lib/subsite-config";

const host = window.location.host;

const indexOfDev = host.indexOf(".dev.");

const config: HostConfig =
  indexOfDev >= 0
    ? {
        host: host.substring(0, indexOfDev) + host.substring(indexOfDev + 4),
        dev: true
      }
    : { host: host, dev: host === "localhost" };

export default config;
