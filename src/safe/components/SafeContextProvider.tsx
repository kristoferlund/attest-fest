import React, { ReactNode, useEffect, useState } from "react";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";

import SafeApiKit from "@safe-global/api-kit";
import { SafeContext } from "../types/use-safe-return";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useEthersSigner } from "../../ethers/hooks/useEthersSigner";
import { useSafeConfig } from "../hooks/useSafeConfig";

export const ReactSafeContext = React.createContext<SafeContext | undefined>(
  undefined
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
  const { chain } = useAccount();
  const rpcSigner = useEthersSigner({ chainId: chain?.id });
  const { address: userAddress } = useAccount();
  const safeConfig = useSafeConfig(chain?.id);

  const [state, setState] = useState<SafeContext>(initialState);

  /**
   * Reset state to initial state on chain change
   */
  function resetState(): void {
    setState(initialState);
  }

  function initializeEthersAdapter(): void {
    if (!rpcSigner) return;
    try {
      const adapter = new EthersAdapter({
        ethers,
        signerOrProvider: rpcSigner,
      });
      setState((prev) => ({
        ...prev,
        ethersAdapter: adapter,
        ethersAdapterError: undefined,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        ethersAdapter: undefined,
        ethersAdapterError: error as Error,
      }));
      console.error(error);
    }
  }

  function initializeSafeApiKit(): void {
    try {
      if (!state.ethersAdapter || !safeConfig || !chain?.id) return;
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
        const ownerResponse = await state.safeApiKit.getSafesByOwner(
          userAddress
        );
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
        if (!state.ethersAdapter || !address || !selectedSafeInSafes) return;
        const safeInstance = await Safe.create({
          ethAdapter: state.ethersAdapter,
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
  useEffect(initializeEthersAdapter, [rpcSigner]);
  useEffect(initializeSafeApiKit, [state.ethersAdapter, safeConfig]);
  useEffect(listSafesByOwner, [state.safeApiKit, userAddress]);
  useEffect(initializeSafeInstance, [
    state.ethersAdapter,
    address,
    selectedSafeInSafes,
  ]);
  useEffect(loadOwnersAndThreshold, [state.safe, userAddress]);

  const safeData = { ...state, address };

  return (
    <ReactSafeContext.Provider value={safeData}>
      {children}
    </ReactSafeContext.Provider>
  );
};
