import {
  SchemaEncoder,
  SchemaRecord,
  Transaction,
} from "@ethereum-attestation-service/eas-sdk";

import { SafeSignature } from "@safe-global/safe-core-sdk-types";
import { SchemaField } from "./schema-field.type";

export type SafeTransactionState = {
  status:
    | "creating"
    | "signing"
    | "created"
    | "error"
    | "executing"
    | "executed";
  txHash?: string;
  signature?: SafeSignature;
  error?: Error;
};

export type transactionStatus =
  | "creating"
  | "attesting"
  | "wait_uid"
  | "success"
  | "error";

export type EasContext = {
  schemaUid: string;
  // eas?: EAS;
  schemaEncoder?: SchemaEncoder;
  schemaEncoderError?: Error;
  schemaRecordIsLoading?: boolean;
  schemaRecord?: SchemaRecord;
  schemaRecordError?: Error;
  schema?: SchemaField[];
  schemaError?: Error;

  safeTransactionState?: SafeTransactionState;

  transactionStatus?: transactionStatus;
  transaction?: Transaction<string[]>;
  attestationUids?: string[];
  transactionError?: unknown;

  createSafeAttestationsTransaction?: () => Promise<void>;
  createAttestations?: () => Promise<void>;
  resetTransactions?: () => void;
};
