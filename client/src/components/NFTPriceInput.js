import { useField } from "react-form";
import { InputGroup } from "@blueprintjs/core";

export const NFTPriceInput = () => {
  const {
    meta: { error },
    getInputProps,
  } = useField("nft_price", {
    validate: validateInput,
    defaultIsTouched: false,
    defaultValue: "",
  });
  return (
    <>
      <InputGroup {...getInputProps()} type="text" />
      <p>{error}</p>
    </>
  );
};

const validateInput = (value) => {
  if (!parseFloat(value, 10)) {
    return "Price must be a number";
  }
  return false;
};
