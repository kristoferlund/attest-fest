import Safe from "@safe-global/protocol-kit";

import SafeApiKit from "@safe-global/api-kit";

export type SafeAddressList = string[];

export type SafeContext = {
  safeApiKit?: SafeApiKit;
  safeApiKitError?: Error;
  safeAddress?: string;
  safe?: Safe;
  safeError?: Error;
  safes?: SafeAddressList;
  safesError?: Error;
  owners: string[] | undefined[];
  threshold: number;
  isCurrentUserOwner: boolean;
  ownersAndThresholdError?: Error;
};
