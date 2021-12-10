import { useField } from "react-form";
import { InputGroup } from "@blueprintjs/core";

export const NFTTitleInput = () => {
  const {
    // meta: { error, isTouched }, TODO: add frontend error handling
    getInputProps,
  } = useField("nft_title", {
    validate: validateInput,
    defaultIsTouched: false,
    defaultValue: "",
  });

  return <InputGroup {...getInputProps()} type="text" />;
};

const validateInput = () => {
  return false;
};
