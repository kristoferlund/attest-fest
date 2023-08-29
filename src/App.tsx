import { CsvEditView } from "./views/CsvEditView";
import { EasContextProvider } from "./eas/components/EasContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "./nav/Navbar";
import { SafeContextProvider } from "./safe/components/SafeContextProvider";
import { SafeInformation } from "./safe/components/SafeInformation";
import { SafeSelect } from "./safe/components/SafeSelect";
import { SchemaInformation } from "./eas/components/SchemaInformation";
import { SchemaInput } from "./eas/components/SchemaInput";
import { Toaster } from "react-hot-toast";
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
        <FontAwesomeIcon icon={faCircleNotch} spin />
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
    <div>
      <Navbar />
      <div className="flex items-center justify-center pt-24">
        <div className="flex flex-col items-center justify-center w-1/2 gap-5">
          {chain?.id && (
            <SafeContextProvider address={selectedSafeAddress}>
              <AppInner />
            </SafeContextProvider>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
