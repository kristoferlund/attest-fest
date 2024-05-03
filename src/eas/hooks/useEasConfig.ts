import { easConfig } from "../eas.config";

export function useEasConfig(chainId?: number) {
  if (!chainId) {
    return undefined;
  }
  const config = easConfig.find((c) => c.id === chainId);
  if (!config) {
    return undefined;
  }
  return config;
}
