import { ValidationError } from "./validation-error.type";

export type CsvValue = {
  type: "value";
  text: string;
  error?: ValidationError | null;
};

export type CsvComma = {
  type: "comma";
  text: ",";
};

export type CsvText = CsvValue | CsvComma;
