import { Background } from "./components/bg/Background";
import { CsvEditView } from "./views/CsvEditView";
import { EasContextProvider } from "./eas/components/EasContextProvider";
import { Hat } from "./components/bg/images/Hat";
import { Navbar } from "./components/nav/Navbar";
import { Pop } from "./components/bg/images/Pop";
import { SafeContextProvider } from "./safe/components/SafeContextProvider";
import { SchemaInformation } from "./components/SchemaInformation";
import { SchemaInput } from "./components/SchemaInput";
import { Thumb } from "./components/bg/images/Thumb";
import { WalletSelect } from "./components/SafeSelect";
import { easConfig } from "./eas/eas.config";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useSafe } from "./safe/hooks/useSafe";
import { useStateStore } from "./zustand/hooks/useStateStore";

function AppInner() {
  //Hooks
  const { safes, owners, threshold } = useSafe();
  const { address, isConnected } = useAccount();

  // Global state
  const selectedWalletAddress = useStateStore(
    (state) => state.selectedWalletAddress
  );
  const schemaUid = useStateStore((state) => state.schemaUid);

  const selectWalletAddress = (selectedAddress: string) =>
    useStateStore.setState({
      selectedWalletAddress: selectedAddress,
    });

  // Clear stored csv on app load
  useEffect(() => {
    useStateStore.setState({
      csv: undefined,
    });
  }, []);

  // Reset selected wallet on address change
  useEffect(() => {
    if (address) {
      if (!safes || safes.length === 0) {
        selectWalletAddress(address);
      } else {
        if (selectedWalletAddress && !safes.includes(selectedWalletAddress)) {
          selectWalletAddress(address);
        }
        if (!selectedWalletAddress) {
          selectWalletAddress(address);
        }
      }
    }
  }, [address, safes, selectedWalletAddress]);

  return (
    <>
      <div className="flex flex-col items-center gap-10 md:hidden">
        <div className="underline">Wallet</div>
        <WalletSelect
          selectedAddress={selectedWalletAddress}
          onChange={(address) =>
            useStateStore.setState({
              selectedWalletAddress: address,
            })
          }
        />
        {selectedWalletAddress !== address && (
          <div className="text-center">
            Required signatures:
            {selectedWalletAddress ? (
              <>
                {threshold} out of {owners.length} owners.
              </>
            ) : (
              <>-</>
            )}
          </div>
        )}
        <div className="underline">Schema UID</div>
        <SchemaInput
          value={schemaUid}
          onChange={(schemaUid) => useStateStore.setState({ schemaUid })}
        />
      </div>
      <div className="flex justify-end w-full">
        <table className=" table-auto text-[8px] text-xs hidden md:block">
          <tbody>
            <tr>
              <td>
                <div className="flex items-center justify-end w-full px-2">
                  Wallet
                </div>
              </td>
              <td className="px-3 border-2 h-14 border-theme4 bg-theme1">
                <WalletSelect
                  selectedAddress={selectedWalletAddress}
                  onChange={selectWalletAddress}
                />
              </td>
            </tr>
            {selectedWalletAddress !== address && (
              <tr>
                <td>
                  <div className="flex items-center justify-end w-full px-2 whitespace-nowrap">
                    Required signatures
                  </div>
                </td>
                <td className="px-3 border-2 h-14 border-theme4 bg-theme1">
                  <div className="flex items-center whitespace-nowrap">
                    {selectedWalletAddress ? (
                      <>
                        {threshold} out of {owners.length} owners.
                      </>
                    ) : (
                      <>-</>
                    )}
                  </div>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <div className="flex items-center justify-end w-full px-2">
                  Schema UID
                </div>
              </td>
              <td className="px-3 border-2 h-14 border-theme4 bg-theme1">
                <SchemaInput
                  value={schemaUid}
                  onChange={(schemaUid) => {
                    if (schemaUid.length === 66 && schemaUid.startsWith("0x")) {
                      useStateStore.setState({ schemaUid });
                    } else {
                      useStateStore.setState({ schemaUid: "" });
                    }
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {address && isConnected && schemaUid && (
        <EasContextProvider schemaUid={schemaUid}>
          <SchemaInformation />
          <CsvEditView />
        </EasContextProvider>
      )}
    </>
  );
}

function App() {
  const { chainId } = useAccount();

  // Global state
  const selectedWalletAddress = useStateStore(
    (state) => state.selectedWalletAddress
  );

  const isConnnectedToSupportedChain = easConfig.some((c) => c.id === chainId);

  const renderNotConnectedToWallet = () => (
    <div className="p-5 text-center">Connect a wallet to start attesting!</div>
  );

  const renderNotSupportedNetwork = () => (
    <div className="p-5 text-center">
      Choose a supported network to start the attest fest!
    </div>
  );

  const renderAppInner = () => (
    <SafeContextProvider address={selectedWalletAddress}>
      <AppInner />
    </SafeContextProvider>
  );

  return (
    <>
      <Background />
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-10 px-5 pb-10 leading-loose pt-60 md:pt-36">
        <div className="flex flex-col items-center p-10 w-full md:w-[768px] border rounded-xl bg-theme1 theme-shadow leading-loose text-center gap-10">
          <div className="flex flex-wrap items-center justify-center gap-5 text-2xl">
            <div className="w-10 h-10 fill-theme4">
              <Thumb />
            </div>
            <div className="w-10 h-10 fill-theme4">
              <Hat />
            </div>
            <div className="w-10 h-10 fill-theme4">
              <Pop />
            </div>
          </div>
          <div>
            Batch create onchain
            <a href="https://attest.sh/" target="_blank">
              <img
                src="/eas.png"
                className="inline-block h-6 pb-1 mx-2 max-w-none"
              />
            </a>
            <a href="https://attest.sh/" target="_blank" className="underline">
              EAS attestations
            </a>{" "}
            using the power of CSV and copy/paste. Supports any old ETH wallet
            as well as fancy new
            <a href="https://safe.global/" target="_blank">
              <img
                src="/safe.png"
                className="inline-block h-6 pb-1 mx-2 max-w-none"
              />
            </a>
            <a
              href="https://safe.global/"
              target="_blank"
              className="underline"
            >
              Safe multisig wallets
            </a>
            .
          </div>
          <div>It's an attest fest, yaay!</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-10 p-10 w-full md:w-[768px] border rounded-xl bg-theme1 theme-shadow">
          {!chainId && renderNotConnectedToWallet()}
          {chainId &&
            !isConnnectedToSupportedChain &&
            renderNotSupportedNetwork()}
          {chainId && isConnnectedToSupportedChain && renderAppInner()}
        </div>
        <a href="https://github.com/kristoferlund/attest-fest" target="_blank">
          <img src="/github.png" className="h-10" />
        </a>
      </div>
    </>
  );
}

export default App;
