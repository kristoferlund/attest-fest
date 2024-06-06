import { PublicClient, isAddress, isHex, size, toHex } from "viem";

import { ParsedValue } from "../types/schema-field-value.type";
import { ValidationError } from "../types/validation-error.type";
import { normalize } from "viem/ens";

// Validate an address that can be either a hex string (0x123...)  or
// an ENS name (e.g. "example.eth")
async function validateAddress(
  value: string,
  publicClient: PublicClient
): Promise<[ParsedValue | null, ValidationError | null]> {
  if (isAddress(value)) {
    return [{ type: "address", value }, null];
  }
  const address = await publicClient.getEnsAddress({
    name: normalize(value),
  });
  if (address) {
    return [{ type: "address", value: address as string }, null];
  }
  return [
    null,
    {
      error: "Invalid address format",
    },
  ];
}

export async function validateEditorValue(
  value: string,
  type: string,
  publicClient: PublicClient
): Promise<[ParsedValue | null, ValidationError | null]> {
  switch (type) {
    case "bool":
      if (value === "true" || value === "false")
        return [
          {
            type: "bool",
            value: value === "true",
          },
          null,
        ];
      return [
        null,
        {
          error: "Invalid boolean value",
        },
      ];
    case "bytes32": {
      if (isHex(value) && size(toHex(value)) === 66) {
        return [{ type: "bytes32", value }, null];
      }
      return [
        null,
        {
          error: "Invalid bytes32 value",
        },
      ];
    }
    case "string":
      return [{ type: "string", value }, null];
    case "address":
      return await validateAddress(value, publicClient);

    case "bytes":
      if (isHex(value)) {
        return [{ type: "bytes", value }, null];
      }
      return [null, { error: "Invalid bytes format" }];

    default:
      if (type.startsWith("uint")) {
        const size = parseInt(type.replace("uint", ""), 10);
        if (size && BigInt(value) >= 0 && BigInt(value) <= BigInt(2 ** size)) {
          return [{ type: "uint", size, value }, null];
        }
        return [
          null,
          {
            error: `Invalid ${type} value`,
          },
        ];
      }
      return [null, { error: "Unsupported type" }];
  }
}
