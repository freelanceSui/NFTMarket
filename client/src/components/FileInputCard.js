import "../index.css";
import { useState, forwardRef } from "react";
import { useField } from "react-form";
import { Card, Icon, FileInput } from "@blueprintjs/core";

export const FileInputCard = () => {
  return (
    <Card className="dashboard-grid__row-middle--grid-item" interactive>
      <div className="dashboard-grid__row-middle--grid-item-content">
        <Icon
          icon="media"
          size="small"
          color="#d3d3d3"
          className="dashboard-grid__row-middle--grid-item--icon"
        />
      </div>
      <div className="dashboard-grid__row-middle--grid-item-footer">
        <NFTAssetUploadField />
      </div>
    </Card>
  );
};

const NFTAssetUploadField = forwardRef((props, ref) => {
  const [fileName, setFileName] = useState(null);

  const NFTAssetUploadFieldInstance = useField("nft_asset", {
    validate: validateInput,
    defaultIsTouched: false,
    defaultValue: "",
  });

  const { getInputProps, value, setValue } = NFTAssetUploadFieldInstance;
  const { ref: _ref } = getInputProps({ ref });

  return (
    <FileInput
      text={fileName || "Upload Image"}
      buttonText="Browse"
      hasSelection={!!value}
      fill
      inputProps={{
        ref: _ref,
        required: true,
        onChange: (event) => {
          const target = event.target;
          const { files } = target;
          if (!files || files.length < 1) {
            setFileName(undefined);
            setValue("");
            return;
          }
          const [file] = Array.from(files);
          setFileName(file.name);
          setValue(file);
        },
        accept: ".png, .jpg",
      }}
    />
  );
});

const validateInput = () => {
  return false;
};
