import React, { ReactNode, useEffect, useState } from "react";
import Safe from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { SafeContext } from "../types/use-safe-return";
import { useAccount } from "wagmi";
import { useSafeConfig } from "../hooks/useSafeConfig";

export const ReactSafeContext = React.createContext<SafeContext | undefined>(
  undefined,
);

const initialState: SafeContext = {
  owners: [] as string[],
  threshold: 0,
  isCurrentUserOwner: false,
};

type SafeProviderProps = {
  address?: string;
  children: ReactNode;
};

export const SafeContextProvider: React.FC<SafeProviderProps> = ({
  address,
  children,
}: SafeProviderProps) => {
  const { chain, connector } = useAccount();
  const { address: userAddress } = useAccount();
  const safeConfig = useSafeConfig(chain?.id);

  const [state, setState] = useState<SafeContext>(initialState);

  /**
   * Reset state to initial state on chain change
   */
  function resetState(): void {
    setState(initialState);
  }

  function initializeSafeApiKit(): void {
    try {
      if (!safeConfig || !chain?.id) return;
      const apiKit = new SafeApiKit({ chainId: BigInt(chain.id) });
      setState((prev) => ({
        ...prev,
        safeApiKit: apiKit,
        safeApiKitError: undefined,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        safeApiKit: undefined,
        safeApiKitError: error as Error,
      }));
      console.error(error);
    }
  }

  function listSafesByOwner(): void {
    void (async (): Promise<void> => {
      try {
        if (!state.safeApiKit || !userAddress) return;
        const ownerResponse =
          await state.safeApiKit.getSafesByOwner(userAddress);
        setState((prev) => ({
          ...prev,
          safes: ownerResponse.safes,
          safesError: undefined,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          safes: undefined,
          safesError: error as Error,
        }));
        console.error(error);
      }
    })();
  }

  const selectedSafeInSafes =
    typeof address !== "undefined" &&
    typeof state.safes !== "undefined" &&
    state.safes.includes(address);

  function initializeSafeInstance(): void {
    void (async (): Promise<void> => {
      try {
        if (!address || !selectedSafeInSafes || !connector) return;
        const provider = await connector.getProvider();
        const safeInstance = await Safe.init({
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          provider: provider as any,
          signer: userAddress,
          safeAddress: address,
        });
        setState((prev) => ({
          ...prev,
          safe: safeInstance,
          safeAddress: address,
          safeError: undefined,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          safe: undefined,
          safeError: error as Error,
        }));
        console.error(error);
      }
    })();
  }

  function loadOwnersAndThreshold(): void {
    void (async (): Promise<void> => {
      try {
        if (!state.safe || !userAddress) return;
        const safeOwners = await state.safe.getOwners();
        const safeThreshold = await state.safe.getThreshold();
        const currentUserIsOwner = safeOwners.includes(userAddress);
        setState((prev) => ({
          ...prev,
          owners: safeOwners,
          threshold: safeThreshold,
          isCurrentUserOwner: currentUserIsOwner,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          ownersAndThresholdError: error as Error,
        }));
        console.error(error);
      }
    })();
  }

  useEffect(resetState, [chain]);
  useEffect(initializeSafeApiKit, [safeConfig, chain]);
  useEffect(listSafesByOwner, [state.safeApiKit, userAddress]);
  useEffect(initializeSafeInstance, [
    address,
    selectedSafeInSafes,
    connector,
    userAddress,
  ]);
  useEffect(loadOwnersAndThreshold, [state.safe, userAddress]);

  const safeData = { ...state, address };

  return (
    <ReactSafeContext.Provider value={safeData}>
      {children}
    </ReactSafeContext.Provider>
  );
};
