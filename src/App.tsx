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
              <table className="min-w-full table-auto text-[8px] md:text-xs">
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
    <div className="p-5 text-center">
      Connect a wallet to start the attest fest!
    </div>
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
      <div className="flex justify-center pt-36 md:pt-36 ">
        <div className="flex flex-col items-center justify-center gap-10 p-10 w-full md:w-[768px] border rounded-xl bg-theme1 app mb-40">
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
