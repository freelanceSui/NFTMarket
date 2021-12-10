import { useEffect, useState, createContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const getProvider = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const walletProvider = new ethers.providers.Web3Provider(connection);
      const walletSigner = walletProvider.getSigner();
      setProvider(walletProvider);
      setSigner(walletSigner);
    };
    if (!provider) {
      getProvider();
    }
  }, [provider]);

  return (
    <WalletContext.Provider value={{ provider, signer }}>
      {children}
    </WalletContext.Provider>
  );
};

export { WalletProvider, WalletContext };
