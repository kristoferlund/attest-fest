import {
  AttestationRequestData,
  MultiAttestationRequest,
  SchemaEncoder,
  SchemaItem,
  SchemaValue,
} from "@ethereum-attestation-service/eas-sdk";
import { PublicClient, isAddress } from "viem";

import { SchemaField } from "../types/schema-field.type";
import { normalize } from "viem/ens";
import { parse } from "csv-parse/sync";

export function shouldIncludeRow(row: string[], schema: SchemaField[]) {
  // Skip optional header row
  // First value matches first schema column name = header row
  if (row[0] === schema[0].name) {
    return false;
  }

  // Skip empty rows
  if (row.length === 0 || (row.length === 1 && row[0] === "")) {
    return false;
  }

  // Skip rows with no recipient
  if (row[row.length - 1] === "") {
    return false;
  }

  // Check if the row has the correct number of columns
  if (row.length !== schema.length) {
    throw new Error(`Invalid number of columns in row`);
  }

  return true;
}

export function encodeRow(
  row: string[],
  schema: SchemaField[],
  schemaEncoder: SchemaEncoder
) {
  // Encode the data
  const items: SchemaItem[] = [];
  for (let i = 0; i < schema.length - 1; i++) {
    // -1 to skip recipient
    const { name, type } = schema[i];
    let value: SchemaValue;
    if (type.startsWith("uint")) {
      value = BigInt(row[i]);
    } else {
      switch (type) {
        case "address":
          value = row[i];
          break;
        case "string":
          value = row[i];
          break;
        case "bool":
          value = row[i] === "true";
          break;
        case "bytes32":
          value = row[i];
          break;
        case "bytes":
          value = row[i];
          break;
        default:
          value = row[i];
          break;
      }
    }

    items.push({
      name,
      value,
      type,
    });
  }

  return schemaEncoder.encodeData(items);
}

export async function processRecipient(
  recipient: string,
  publicClient: PublicClient
): Promise<string> {
  if (isAddress(recipient)) {
    return recipient;
  }
  const address = await publicClient.getEnsAddress({
    name: normalize(recipient),
  });
  if (address) {
    return address as string;
  }
  throw new Error("Invalid recipient");
}

export async function createMultiAttestRequest(
  csv: string,
  schemaUid: string,
  schemaFields: SchemaField[],
  schemaEncoder: SchemaEncoder,
  revocable: boolean,
  publicClient: PublicClient
): Promise<MultiAttestationRequest> {
  const parsedCsv: string[][] = parse(csv, {
    relax_column_count: true,
    relax_quotes: true,
    trim: true,
  });

  const data: AttestationRequestData[] = [];
  for (const row of parsedCsv) {
    if (!shouldIncludeRow(row, schemaFields)) {
      continue;
    }

    const encodedData = encodeRow(row, schemaFields, schemaEncoder);

    data.push({
      recipient: await processRecipient(row[row.length - 1], publicClient),
      expirationTime: 0n, // placeholder value
      revocable: revocable,
      refUID:
        "0x0000000000000000000000000000000000000000000000000000000000000000", // placeholder value
      data: encodedData,
      value: 0n, // placeholder value
    });
  }

  return {
    schema: schemaUid,
    data,
  };
}
