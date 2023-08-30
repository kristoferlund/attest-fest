import { Background } from "./components/bg/Background";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "./components/nav/Navbar";
import { SafeContextProvider } from "./safe/components/SafeContextProvider";
import { SafeSelect } from "./components/SafeSelect";
import { SchemaInput } from "./components/SchemaInput";
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
              <table className="min-w-full table-auto ">
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
                        {threshold} out of {owners.length} owners.
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

              {/* <div className="border-2 border-theme4 rounded-xl">
                <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-theme4 border-theme4">
                  <div className="flex items-center justify-end w-full p-2">
                    Safe account
                  </div>
                  <SafeSelect
                    selectedSafeAddress={selectedSafeAddress}
                    onChange={(address) =>
                      useStateStore.setState({ selectedSafeAddress: address })
                    }
                  />
                  <div className="flex items-center justify-end w-full p-2">
                    Required signatures
                  </div>
                  <div className="flex items-center justify-end w-full p-2">
                    <strong>{threshold}</strong> out of{" "}
                    <strong>{owners.length} owners</strong>.
                  </div>
                  <div className="flex items-center justify-end w-full p-2">
                    Schema UID
                  </div>
                  <div className="flex items-center justify-end w-full p-2">
                    <SchemaInput
                      value={schemaUid}
                      onChange={(schemaUid) =>
                        useStateStore.setState({ schemaUid })
                      }
                    />
                  </div>
                </div>
              </div>
              {selectedSafeAddress && owners?.length > 0 && (
                <>
                  <SafeInformation />
                  <SchemaInput
                    value={schemaUid}
                    onChange={(schemaUid) =>
                      useStateStore.setState({ schemaUid })
                    }
                  />
                </>
              )}

              {schemaUid && (
                <EasContextProvider schemaUid={schemaUid}>
                  <SchemaInformation />
                  <CsvEditView />
                </EasContextProvider>
              )} */}
            </>
          ) : (
            <p className="text-center">
              The connected wallet is not owner of any safes. Connect with
              another wallet or create a safe at{" "}
              <a href="https://safe.global/" target="_blank">
                safe.global
              </a>
            </p>
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

  return (
    <>
      <Background />
      <Navbar />
      <div className="flex justify-center pt-36 md:pt-24 ">
        <div className="flex flex-col items-center justify-center gap-5 p-5 w-full md:w-[768px]">
          <div className="p-2 text-theme1 bg-theme4">Attest Fest</div>
          <div className="p-1 text-white bg-red-500">Beta</div>
          <div className="text-center">Create many attestations at a time.</div>
          {chain?.id && (
            <SafeContextProvider address={selectedSafeAddress}>
              <AppInner />
            </SafeContextProvider>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
