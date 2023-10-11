import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useEffect, useState } from "react";

import { MultiAttestationRequest } from "@ethereum-attestation-service/eas-sdk";
import { encodeCsv } from "../utils/encodeCsv";
import { useEas } from "./useEas";
import { useEasConfig } from "./useEasConfig";
import { useStateStore } from "../../zustand/hooks/useStateStore";

export function useEasMultiAttest() {
  const { chain } = useNetwork();
  const easConfig = useEasConfig(chain?.id);
  const { schema, schemaEncoder, schemaUid } = useEas();

  // Global state
  const csv = useStateStore((state) => state.csv);

  // Local state
  const [requestData, setRequestData] = useState<MultiAttestationRequest>();

  useEffect(() => {
    if (!csv || !schema || !schemaEncoder) return;

    const multiAttestationRequest = {
      schema: schemaUid,
      data: encodeCsv(csv, schema, schemaEncoder),
    };

    setRequestData(multiAttestationRequest);
  }, [csv, schema, schemaEncoder, schemaUid]);

  console.log("requestData", requestData);

  const { config } = usePrepareContractWrite({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    address: easConfig?.address || ("" as any),
    abi: [
      {
        inputs: [
          {
            components: [
              { internalType: "bytes32", name: "schema", type: "bytes32" },
              {
                components: [
                  {
                    internalType: "address",
                    name: "recipient",
                    type: "address",
                  },
                  {
                    internalType: "uint64",
                    name: "expirationTime",
                    type: "uint64",
                  },
                  { internalType: "bool", name: "revocable", type: "bool" },
                  { internalType: "bytes32", name: "refUID", type: "bytes32" },
                  { internalType: "bytes", name: "data", type: "bytes" },
                  { internalType: "uint256", name: "value", type: "uint256" },
                ],
                internalType: "struct AttestationRequestData[]",
                name: "data",
                type: "tuple[]",
              },
            ],
            internalType: "struct MultiAttestationRequest[]",
            name: "multiRequests",
            type: "tuple[]",
          },
        ],
        name: "multiAttest",
        outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "multiAttest",
    args: [[requestData]],
    enabled: !!requestData,
  });

  const contract = useContractWrite(config);

  const transaction = useWaitForTransaction({
    hash: contract?.data?.hash,
  });

  return {
    contract,
    transaction,
  };
}
