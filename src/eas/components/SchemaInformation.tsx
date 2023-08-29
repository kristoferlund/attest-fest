import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useEas } from "../hooks/useEas";

export function SchemaInformation() {
  const { schemaRecordIsLoading, schemaRecordError, schemaError } = useEas();

  return (
    <>
      {schemaRecordIsLoading && <FontAwesomeIcon icon={faCircleNotch} spin />}

      {schemaRecordError && <div>{schemaRecordError.message}</div>}

      {schemaError && (
        <div>
          Attestation schemas using arrays are not yet supported.{" "}
          {schemaError.message}
        </div>
      )}
    </>
  );
}
