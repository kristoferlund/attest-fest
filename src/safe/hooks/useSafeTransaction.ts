// Internal imports
import { useAccount, useNetwork } from "wagmi";
// External package imports
import { useEffect, useState } from "react";

import { ExecuteSafeTransactionStateType } from "../types/execute-safe-transaction-state.type";
import { SafeMultisigTransactionResponse } from "@safe-global/safe-core-sdk-types";
import { SignSafeTransactionStateType } from "../types/sign-safe-transaction-state.type";
import { errorHasMessage } from "../../eth/util/errorHasMessage";
import { errorHasReason } from "../../eth/util/errorHasReason";
import { errorMessage } from "../errorCodes";
import { isExecuteError } from "../util/isExecuteError";
import { toast } from "react-hot-toast";
import { useSafe } from "./useSafe";
import { useSafeConfig } from "./useSafeConfig";

type UseSafeTransactionReturn = {
  transaction?: SafeMultisigTransactionResponse;
  moreConfirmationsRequired?: boolean;
  mySignatureAwaited?: boolean;
  signState?: SignSafeTransactionStateType;
  signTransaction?: () => void;
  executeState?: ExecuteSafeTransactionStateType;
  executeTransaction?: () => void;
  explorerUrl?: string;
};

type UseSafeTransactionProps = {
  safeTxHash?: string;
};
/**
 * Custom hook to interface with Safe transactions.
 * @returns An object containing Safe transaction information and utilities.
 */
export function useSafeTransaction({
  safeTxHash,
}: UseSafeTransactionProps): UseSafeTransactionReturn {
  // Hooks
  const { address: userAddress } = useAccount();
  const { safe, safeApiKit } = useSafe();
  const { chain } = useNetwork();
  const safeConfig = useSafeConfig(chain?.id);

  // Local state
  const [mySignatureAwaited, setMySignatureAwaited] = useState<boolean>();
  const [transaction, setTransaction] =
    useState<SafeMultisigTransactionResponse>();
  const [signState, setSignState] = useState<SignSafeTransactionStateType>();
  const [executeState, setExecuteState] =
    useState<ExecuteSafeTransactionStateType>();

  function loadTransaction(): void {
    if (!safeTxHash || !safeApiKit) return;
    void (async (): Promise<void> => {
      try {
        const tx = await safeApiKit.getTransaction(safeTxHash);
        safeApiKit.getServiceInfo;
        setTransaction(tx);
      } catch (e) {
        if (errorHasReason(e) && e.reason) {
          toast.error(e.reason);
        } else if (errorHasMessage(e) && e.message) {
          toast.error(e.message);
        }
      }
    })();
  }

  /**
   *  Check if the user's signature is required for the transaction.
   */
  function checkIfMySignatureAwaited(): void {
    if (!userAddress || !safe || !transaction) return;
    void (async (): Promise<void> => {
      const isOwner = await safe.isOwner(userAddress);
      setMySignatureAwaited(
        isOwner &&
          !transaction.confirmations?.find((c) => c.owner === userAddress)
      );
    })();
  }

  function signTransaction(): void {
    if (!safe || !safeTxHash || !safeApiKit) {
      return;
    }
    void (async (): Promise<void> => {
      setSignState({ state: "signing" });
      try {
        const signature = await safe.signTransactionHash(safeTxHash);
        await safeApiKit.confirmTransaction(safeTxHash, signature.data);
        setSignState({ state: "signed" });
      } catch (e) {
        if (errorHasReason(e) && e.reason) {
          toast.error(e.reason);
        } else if (errorHasMessage(e) && e.message) {
          toast.error(e.message);
        }
        setSignState({ state: "error", error: e as Error });
      }
    })();
  }

  /**
   * Fetch the indexing status of the transaction every 10 seconds until it is indexed.
   */
  function awaitTransactionIndexing(): void {
    void (async (): Promise<void> => {
      if (!transaction) return;
      const response = await fetch(
        `${safeConfig?.serviceUrl}/api/v1/multisig-transactions/${transaction.safeTxHash}`
      );
      if (response.ok) {
        const tx = (await response.json()) as SafeMultisigTransactionResponse;
        if (tx.isExecuted) {
          setExecuteState({ state: "executed" });
          setTimeout(() => {
            setTransaction(tx);
          }, 2000);
          return;
        }
        setTimeout(awaitTransactionIndexing, 10000);
      }
    })();
  }

  function executeTransaction(): void {
    if (!safe || !safeTxHash || !safeApiKit) {
      return;
    }
    void (async (): Promise<void> => {
      if (!transaction) return;
      setExecuteState({ state: "executing" });
      try {
        const txResponse = await safe.executeTransaction(transaction);
        await txResponse.transactionResponse?.wait();
        setExecuteState({ state: "indexing" });
        setTimeout(awaitTransactionIndexing, 10000); // Check every 10 seconds if the transaction has been indexed
      } catch (e) {
        console.error("Unable to execute transaction", e);

        if (isExecuteError(e)) {
          const tenderlySimulationRequest = {
            to: e.transaction.to,
            input: e.transaction.data,
            network_id: "10",
            from: e.transaction.from,
            gas: 30000000,
            gas_price: "0",
            save: true,
            save_if_fails: true,
          };

          // Fetch additional transaction errors from running a Tenderly simulation
          const tenderlyResponse = await fetch(
            "https://simulation.safe.global/",
            {
              method: "POST",
              body: JSON.stringify(tenderlySimulationRequest),
            }
          );

          const json = await tenderlyResponse.json();
          if ("simulation" in json) {
            if (json.simulation.error_message) {
              let msg = json.simulation.error_message;
              if (msg.startsWith("GS")) {
                msg = errorMessage(msg);
                if (msg) {
                  toast.error(msg);
                }
              } else {
                toast.error(msg);
              }
            }
          }
        }

        if (errorHasReason(e) && e.reason) {
          toast.error(e.reason);
        } else if (errorHasMessage(e) && e.message) {
          toast.error(e.message);
        }
        setExecuteState({ state: "error", error: e as Error });
      }
    })();
  }

  const moreConfirmationsRequired =
    transaction?.confirmations &&
    transaction?.confirmationsRequired > 0 &&
    transaction.confirmations.length < transaction.confirmationsRequired;

  const explorerUrl = `${safeConfig?.explorerUrl}/tx/${transaction?.transactionHash}`;

  useEffect(loadTransaction, [safeTxHash, safeApiKit]);
  useEffect(checkIfMySignatureAwaited, [userAddress, safe, transaction]);

  return {
    transaction,
    moreConfirmationsRequired,
    mySignatureAwaited,
    signState,
    signTransaction,
    executeState,
    executeTransaction,
    explorerUrl,
  };
}
