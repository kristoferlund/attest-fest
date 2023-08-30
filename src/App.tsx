import { Background } from "./components/bg/Background";
import { CsvEditView } from "./views/CsvEditView";
import { EasContextProvider } from "./eas/components/EasContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "./components/nav/Navbar";
import { SafeContextProvider } from "./safe/components/SafeContextProvider";
import { SafeInformation } from "./components/SafeInformation";
import { SafeSelect } from "./components/SafeSelect";
import { SchemaInformation } from "./components/SchemaInformation";
import { SchemaInput } from "./components/SchemaInput";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useNetwork } from "wagmi";
import { useSafe } from "./safe/hooks/useSafe";
import { useStateStore } from "./zustand/hooks/useStateStore";

function AppInner() {
  //Hooks
  const { safes, owners } = useSafe();

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
              <SafeSelect
                selectedSafeAddress={selectedSafeAddress}
                onChange={(address) =>
                  useStateStore.setState({ selectedSafeAddress: address })
                }
              />
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
              )}
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
          <div className="text-theme1 bg-theme4">Attest Fest</div>
          <div className="text-white bg-red-500">Beta</div>
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
