import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import {
  MetaTransactionData,
  OperationType,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import React, { ReactNode, useEffect, useState } from "react";
import { encodeRow, shouldIncludeRow } from "../utils/encodeCsv";
import { useProvider, useSigner } from "../../wagmi/hooks/useSigner";

import { EasContext } from "../types/eas-context-value.type";
import { SchemaField } from "../types/schema-field.type";
import { isSchemaFieldTypeName } from "../utils/isSchemaFieldTypeName";
import { parse } from "csv-parse/sync";
import { useEasConfig } from "../hooks/useEasConfig";
import { useNetwork } from "wagmi";
import { useSafe } from "../../safe/hooks/useSafe";

export const ReactEasContext = React.createContext<EasContext | undefined>(
  undefined
);

type EasProviderProps = {
  schemaUid: string;
  children: ReactNode;
};

export const EasContextProvider: React.FC<EasProviderProps> = ({
  schemaUid,
  children,
}: EasProviderProps) => {
  // Hooks
  const { safeAddress, safe, safeApiKit, ethersAdapter } = useSafe();
  const { chain } = useNetwork();
  const easConfig = useEasConfig(chain?.id);
  const rpcProvider = useProvider();
  const rpcSigner = useSigner();

  // Local state
  const [state, setState] = useState<EasContext>({ schemaUid });

  function initEas() {
    if (!easConfig?.address) return;
    setState((previous) => ({ ...previous, eas: new EAS(easConfig.address) }));
  }

  function loadSchemaRecord() {
    if (!easConfig || !rpcProvider || !schemaUid) {
      return;
    }
    void (async () => {
      setState((prev) => ({
        ...prev,
        schemaError: undefined,
        schemaRecordIsLoading: true,
        schemaRecordError: undefined,
      }));
      try {
        const schemaRegistry = new SchemaRegistry(easConfig.registryAddress);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schemaRegistry.connect(rpcProvider as any);
        if (!schemaUid) {
          return;
        }
        const schemaRecord = await schemaRegistry.getSchema({
          uid: schemaUid,
        });
        setState((prev) => ({
          ...prev,
          schemaRecord: schemaRecord,
          schemaRecordIsLoading: false,
        }));
      } catch (err) {
        console.error(err);
        setState((prev) => ({
          ...prev,
          schemaRecord: undefined,
          schemaRecordIsLoading: false,
          schemaRecordError: err as Error,
        }));
      }
    })();
  }

  function createSchemaFromRecord() {
    if (!state.schemaRecord) {
      return;
    }
    const schema: SchemaField[] = [];
    state.schemaRecord.schema.split(",").forEach((field) => {
      const [type, name] = field.trim().split(" ");
      if (isSchemaFieldTypeName(type)) {
        schema.push({ name, type });
      } else {
        const err = new Error(`Invalid type name: ${type}`);
        console.error(err);
        setState((prev) => ({ ...prev, schemaError: err }));
      }
    });
    schema.push({ name: "recipient", type: "address" });
    setState((prev) => ({
      ...prev,
      schema,
    }));
  }

  function initSchemaEncoder() {
    if (!state.schemaRecord?.schema) return;
    try {
      const schemaEncoder = new SchemaEncoder(state.schemaRecord?.schema);
      setState((prev) => ({ ...prev, schemaEncoder }));
    } catch (err) {
      console.error(
        `Unable to create schema encoder for schema: "${state.schemaRecord?.schema}"`
      );
      console.error(err);
      setState((prev) => ({ ...prev, schemaEncoderError: err as Error }));
    }
  }

  function parseCsv(csv: string) {
    return parse(csv, {
      relax_column_count: true,
      relax_quotes: true,
      trim: true,
    });
  }

  const createSafeAttestationsTransaction = async (
    csv: string
  ): Promise<void> => {
    try {
      if (
        !rpcSigner ||
        !safeAddress ||
        !safe ||
        !safeApiKit ||
        !ethersAdapter ||
        !state.eas ||
        !state.schemaEncoder ||
        !state.schema
      ) {
        throw new Error("Missing signer, safe, safeApiKit or ethersAdapter");
      }

      setState((prev) => ({
        ...prev,
        safeTransactionState: {
          status: "creating",
        },
      }));

      const safeTransactionData: MetaTransactionData[] = [];
      const parsedCsv: string[][] = parseCsv(csv);

      for (const row of parsedCsv) {
        if (!shouldIncludeRow(row, state.schema)) {
          continue;
        }

        const encodedData = encodeRow(row, state.schema, state.schemaEncoder);

        // Create the transaction data
        const txData: SafeTransactionDataPartial = {
          to: state.eas.contract.address,
          value: "0",
          data: state.eas.contract.interface.encodeFunctionData("attest", [
            {
              schema: schemaUid,
              data: {
                recipient: row[row.length - 1], // Last column should contain the recipient address
                expirationTime: 0,
                revocable: false,
                refUID:
                  "0x0000000000000000000000000000000000000000000000000000000000000000",
                data: encodedData,
                value: 0,
              },
            },
          ]),
          operation: OperationType.Call,
        };

        // Add the transaction data to the list
        safeTransactionData.push(txData);
      }

      const safeTransaction = await safe.createTransaction({
        safeTransactionData,
        options: {
          nonce: await safeApiKit.getNextNonce(safeAddress),
        },
      });

      const signerAddress = await rpcSigner.getAddress();
      const txHash = await safe.getTransactionHash(safeTransaction);

      setState((prev) => ({
        ...prev,
        safeTransactionState: {
          status: "signing",
          txHash,
        },
      }));

      const signature = await safe.signTransactionHash(txHash);

      // Propose transaction to the service
      await safeApiKit.proposeTransaction({
        safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash: txHash,
        senderAddress: signerAddress,
        senderSignature: signature.data,
      });

      console.log("Proposed a transaction with Safe:", safeAddress);
      console.log("- Transaction hash:", txHash);
      console.log("- Signer address:", signerAddress);
      console.log("- Signature:", signature.data);

      setState((prev) => ({
        ...prev,
        safeTransactionState: {
          status: "created",
          txHash,
          signature,
        },
      }));
    } catch (e) {
      setState((prev) => ({
        ...prev,
        safeTransactionState: {
          status: "error",
          error: e as Error,
        },
      }));
      console.error("Error creating transaction", e);
    }
  };

  useEffect(initEas, [easConfig?.address]);
  useEffect(loadSchemaRecord, [easConfig, rpcProvider, schemaUid]);
  useEffect(createSchemaFromRecord, [state.schemaRecord]);
  useEffect(initSchemaEncoder, [state.schemaRecord?.schema]);

  const context = {
    ...state,
    createSafeAttestationsTransaction,
  };

  return (
    <ReactEasContext.Provider value={context}>
      {children}
    </ReactEasContext.Provider>
  );
};
