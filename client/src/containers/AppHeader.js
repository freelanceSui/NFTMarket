import { Link } from "react-router-dom";
import { ConnectWallet } from "../components/ConnectWallet";

export const AppHeader = ({ title }) => {
  return (
    <div className="app-header">
      <div className="app-header__nav">
        <Link to="/dashboard">
          <h2 className={`${title === "Dashboard" && "active"}`}>Dashboard</h2>
        </Link>
        <Link to="/marketplace">
          <h2 className={`${title === "Marketplace" && "active"}`}>
            Marketplace
          </h2>
        </Link>
      </div>
      <ConnectWallet />
    </div>
  );
};
