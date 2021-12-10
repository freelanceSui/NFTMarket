import "./index.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import { Web3ReactProvider } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";
import { WalletProvider } from "./context/walletContext";

import { AppSidebar } from "./containers/AppSidebar";

export const SUPPORTED_CHAINS = {
  1: "Mainnet",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Goerli",
  42: "Kovan",
  31337: "Hardhat - Dev",
};

export const injected = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan]
    31337, // Hardhat - Dev
  ],
});

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletProvider>
        <div className="app-wrapper">
          <AppSidebar />
        </div>
      </WalletProvider>
    </Web3ReactProvider>
  );
}

export default App;
