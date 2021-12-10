import { useField } from "react-form";
import { TextArea } from "@blueprintjs/core";

export const NFTDescriptionInput = () => {
  const {
    // meta: { error, isTouched }, TODO: add frontend error handling
    getInputProps,
  } = useField("nft_description", {
    validate: validateInput,
    defaultIsTouched: false,
    defaultValue: "",
  });
  return (
    <TextArea
      {...getInputProps()}
      large={true}
      fill
      className="dashboard-grid__row-middle--grid-item-text-area"
    />
  );
};

const validateInput = () => {
  return false;
};
