import "../index.css";
import { Card } from "@blueprintjs/core";

import { NFTTitleInput } from "./NFTTitleInput";
import { NFTPriceInput } from "./NFTPriceInput";
import { NFTDescriptionInput } from "./NFTDescriptionInput";

export const FileMetaCard = () => {
  return (
    <Card className="dashboard-grid__row-middle--grid-item" interactive minimal>
      <div style={{ width: "100%" }}>
        <h4>Title</h4>
        <NFTTitleInput />
        <h4>Price (ETH)</h4>
        <NFTPriceInput />
        <h4>Description</h4>
        <NFTDescriptionInput />
      </div>
    </Card>
  );
};
