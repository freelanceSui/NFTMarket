import { useContext } from "react";
import { WalletContext } from "../context/walletContext";

const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletProvider must be used within a WalletProvider");
  }
  return context;
};

export { useWalletContext };
