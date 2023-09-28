import { Background } from "./components/bg/Background";
import { CsvEditView } from "./views/CsvEditView";
import { EasContextProvider } from "./eas/components/EasContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "./components/nav/Navbar";
import { SafeContextProvider } from "./safe/components/SafeContextProvider";
import { SafeSelect } from "./components/SafeSelect";
import { SchemaInformation } from "./components/SchemaInformation";
import { SchemaInput } from "./components/SchemaInput";
import { easConfig } from "./eas/eas.config";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useNetwork } from "wagmi";
import { useSafe } from "./safe/hooks/useSafe";
import { useStateStore } from "./zustand/hooks/useStateStore";
import { Thumb } from "./components/bg/images/Thumb";
import { Hat } from "./components/bg/images/Hat";
import { Pop } from "./components/bg/images/Pop";

function AppInner() {
  //Hooks
  const { safes, owners, threshold } = useSafe();

  // Global state
  const selectedSafeAddress = useStateStore(
    (state) => state.selectedSafeAddress
  );
  const schemaUid = useStateStore((state) => state.schemaUid);

  return (
    <>
      {safes ? (
        <>
          {safes.length > 0 ? (
            <>
              <div className="flex flex-col items-center gap-10 md:hidden">
                <div className="underline">Safe account</div>
                <SafeSelect
                  selectedSafeAddress={selectedSafeAddress}
                  onChange={(address) =>
                    useStateStore.setState({
                      selectedSafeAddress: address,
                    })
                  }
                />
                <div className="text-center">
                  Required signatures:
                  {selectedSafeAddress ? (
                    <>
                      {threshold} out of {owners.length} owners.
                    </>
                  ) : (
                    <>-</>
                  )}
                </div>
                <div className="underline">Schema UID</div>
                <SchemaInput
                  value={schemaUid}
                  onChange={(schemaUid) =>
                    useStateStore.setState({ schemaUid })
                  }
                />
              </div>
              <table className="min-w-full table-auto text-[8px] text-xs hidden md:block">
                <tbody>
                  <tr>
                    <td>
                      <div className="flex items-center justify-end w-full px-2">
                        Safe account
                      </div>
                    </td>
                    <td className="px-3 border-2 h-14 border-theme4 bg-theme1">
                      <SafeSelect
                        selectedSafeAddress={selectedSafeAddress}
                        onChange={(address) =>
                          useStateStore.setState({
                            selectedSafeAddress: address,
                          })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex items-center justify-end w-full px-2 whitespace-nowrap">
                        Required signatures
                      </div>
                    </td>
                    <td className="px-3 border-2 h-14 border-theme4 bg-theme1">
                      <div className="flex items-center whitespace-nowrap">
                        {selectedSafeAddress ? (
                          <>
                            {threshold} out of {owners.length} owners.
                          </>
                        ) : (
                          <>-</>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex items-center justify-end w-full px-2">
                        Schema UID
                      </div>
                    </td>
                    <td className="px-3 border-2 h-14 border-theme4 bg-theme1">
                      <SchemaInput
                        value={schemaUid}
                        onChange={(schemaUid) =>
                          useStateStore.setState({ schemaUid })
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              {schemaUid && (
                <EasContextProvider schemaUid={schemaUid}>
                  <SchemaInformation />
                  <CsvEditView />
                </EasContextProvider>
              )}
            </>
          ) : (
            <div className="p-5 text-center text-white bg-red-500">
              The connected address is not the owner of any Safe account.
              Connect with another wallet or create a safe at{" "}
              <a href="https://safe.global/" target="_blank">
                safe.global
              </a>
            </div>
          )}
        </>
      ) : (
        <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
      )}
    </>
  );
}

function App() {
  const { chain } = useNetwork();

  // Global state
  const selectedSafeAddress = useStateStore(
    (state) => state.selectedSafeAddress
  );

  const isConnnectedToSupportedChain = easConfig.some(
    (c) => c.id === chain?.id
  );

  const renderNotConnectedToWallet = () => (
    <div className="p-5 text-center">Connect a wallet to start attesting!</div>
  );

  const renderNotSupportedNetwork = () => (
    <div className="p-5 text-center">
      Choose a supported network to start the attest fest!
    </div>
  );

  const renderAppInner = () => (
    <SafeContextProvider address={selectedSafeAddress}>
      <AppInner />
    </SafeContextProvider>
  );

  return (
    <>
      <Background />
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-10 px-5 leading-loose pt-60 md:pt-36">
        <div className="flex flex-col items-center p-10 w-full md:w-[768px] border rounded-xl bg-theme1 theme-shadow leading-loose text-center gap-10">
          <div className="flex items-center gap-5 text-2xl">
            <a href="https://safe.global/" target="_blank">
              <img src="/safe.png" className="inline-block h-10 rounded-sm" />
            </a>
            +
            <a href="https://attest.sh/" target="_blank">
              <img src="/eas.png" className="inline-block h-10" />
            </a>
            =
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
            Create multiple{" "}
            <a href="https://attest.sh/" target="_blank" className="underline">
              EAS attestations
            </a>{" "}
            using the power of CSV and{" "}
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
        <div className="flex flex-col items-center justify-center gap-10 p-10 w-full md:w-[768px] border rounded-xl bg-theme1 theme-shadow mb-40">
          {!chain?.id && renderNotConnectedToWallet()}
          {chain?.id &&
            !isConnnectedToSupportedChain &&
            renderNotSupportedNetwork()}
          {chain?.id && isConnnectedToSupportedChain && renderAppInner()}
        </div>
      </div>
    </>
  );
}

export default App;
