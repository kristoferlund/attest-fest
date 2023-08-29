import { CopyButton } from "../components/CopyButton";
import { ExecuteAttestationsButton } from "../safe/components/ExecuteAttestationsButton";
import { LineListItem } from "../components/LineListItem";
import { SignAttestationsButton } from "../safe/components/SignAttestationsButton";
import { shortenEthAddress } from "../util/string";
import { useNetwork } from "wagmi";
import { useSafe } from "../safe/hooks/useSafe";
import { useSafeConfig } from "../safe/hooks/useSafeConfig";
import { useSafeTransaction } from "../safe/hooks/useSafeTransaction";

type TransactionProps = {
  safeTxHash: string;
};
export function Transaction({ safeTxHash }: TransactionProps) {
  const { isCurrentUserOwner } = useSafe();
  const {
    transaction,
    executeState,
    executeTransaction,
    moreConfirmationsRequired,
    mySignatureAwaited,
    signState,
    signTransaction,
    explorerUrl,
  } = useSafeTransaction({ safeTxHash });
  const { chain } = useNetwork();
  const safeConfig = useSafeConfig(chain?.id);

  console.log(chain);
  return (
    <ul>
      <LineListItem variant="check">
        <strong>Transaction proposed</strong>
      </LineListItem>

      <LineListItem variant="dot" size="small">
        <div className="flex flex-col p-2 leading-7 bg-opacity-50 bg-warm-gray-200">
          <div className="flex items-center">
            Safe transaction hash:{" "}
            <a
              href={`https://app.safe.global/transactions/tx?id=multisig_${transaction?.safe}_${safeTxHash}&safe=${safeConfig?.safeChainAbbreviation}:${transaction?.safe}`}
              target="_blank"
              rel="noreferrer"
              className="ml-1"
            >
              {shortenEthAddress(safeTxHash || "")}
            </a>
            <CopyButton textToCopy={safeTxHash || ""} />
          </div>
        </div>
      </LineListItem>

      <LineListItem variant={moreConfirmationsRequired ? "minus" : "check"}>
        <strong>
          Transaction confirmations ({transaction?.confirmations?.length} of{" "}
          {transaction?.confirmationsRequired})
        </strong>
      </LineListItem>

      <LineListItem variant="dot" size="small">
        <div className="flex flex-col p-2 leading-7 bg-opacity-50 bg-warm-gray-200">
          {transaction?.confirmations?.map((c) => (
            <div key={c.owner} className="flex items-center">
              {shortenEthAddress(c.owner || "")}
            </div>
          ))}
        </div>
      </LineListItem>

      {mySignatureAwaited && moreConfirmationsRequired && (
        <LineListItem variant="dot" size="small" liClassName="pt-2">
          <div className="flex items-center p-2 leading-5 bg-opacity-50 bg-warm-gray-200">
            Transaction is awaiting your signature
            <SignAttestationsButton
              onClick={signTransaction}
              signState={signState}
            />
          </div>
        </LineListItem>
      )}

      {moreConfirmationsRequired && (
        <LineListItem variant="minus">
          Transaction can be executed once the threshold is reached
        </LineListItem>
      )}

      {!moreConfirmationsRequired && !transaction?.isExecuted && (
        <>
          <LineListItem variant="minus">
            <strong>Transaction is ready to be executed</strong>
          </LineListItem>

          <LineListItem variant="dot" size="small">
            {isCurrentUserOwner && (
              <div className="flex items-center p-2 leading-5 bg-opacity-50 bg-warm-gray-200">
                As a safe owner you can execute the transaction
                <ExecuteAttestationsButton
                  onClick={executeTransaction}
                  executeState={executeState}
                />
              </div>
            )}
            {!isCurrentUserOwner &&
              "The transaction can be executed by any owner."}
          </LineListItem>
        </>
      )}

      {transaction?.isExecuted && (
        <>
          <LineListItem variant="check">
            <strong>Transaction has been executed</strong>
          </LineListItem>

          <LineListItem variant="dot" size="small">
            <div className="flex flex-col p-2 leading-7 bg-opacity-50 bg-warm-gray-200">
              <div className="flex items-center">
                Transaction:
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1"
                >
                  {shortenEthAddress(transaction.transactionHash || "")}
                </a>
                <CopyButton textToCopy={transaction?.transactionHash || ""} />
              </div>
              <div className="flex items-center">
                Executor:
                <a
                  href={`${safeConfig?.explorerUrl}/address/${transaction.executor}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1"
                >
                  {shortenEthAddress(transaction.executor || "")}
                </a>
                <CopyButton textToCopy={transaction?.executor || ""} />
              </div>
            </div>
          </LineListItem>
        </>
      )}
    </ul>
  );
}
