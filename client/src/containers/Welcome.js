import "../index.css";
import { Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";

export const Welcome = () => {
  return (
    <div className="welcome-page">
      <h1>Welcome to TitleX</h1>
      <h3>A NFT vehicle marketplace</h3>

      <Link to="/dashboard">
        <Button text="Launch App" />
      </Link>
    </div>
  );
};
