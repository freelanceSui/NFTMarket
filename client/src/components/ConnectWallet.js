import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Button, Tag } from "@blueprintjs/core";
import { injected } from "../App";
import { ethers } from "ethers";

import { SUPPORTED_CHAINS } from "../App";
import { Identicon } from "../components/Identicon";

export const ConnectWallet = () => {
  const { chainId, account, activate } = useWeb3React();
  const [isWalletConnected, setIsWalletConnected] = useState(account);
  const [balanceInEth, setBalanceInEth] = useState(null);

  useEffect(() => {
    setIsWalletConnected(account);
  }, [account, setIsWalletConnected]);

  useEffect(() => {
    // call the smart contract, send an update
    async function getBalance() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalanceInEth(`${ethers.utils.formatEther(balance)} ETH`);
      } catch (err) {
        console.log(err);
      }
    }
    getBalance();
  }, [account]);

  // you can't "log out" of metamask through a client side app
  // user must log out through their wallet for security concerns. common practice in Defi platforms (see uniswap)
  // this is an ongoing issue with metamask.
  // request access to the user's MetaMask account
  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log("EXCEPTION: ", ex);
    }
  }

  const slugifyAccount = (account) => {
    if (account) {
      let accountString = account;
      let pre = accountString.slice(0, 6);
      let post = accountString.slice(account.length - 4);
      return `${pre}...${post}`;
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="app-header__connect-wallet-wrapper">
        <Button intent="success" onClick={connect} text="Connect Wallet" />
      </div>
    );
  }

  return (
    <div className="app-header__connect-wallet-wrapper">
      <Tag className="wallet-tag">{SUPPORTED_CHAINS[chainId]}</Tag>
      <Tag className="wallet-tag">{balanceInEth}</Tag>
      <Button
        className="wallet-tag"
        intent="success"
        text={slugifyAccount(account)}
        rightIcon={<Identicon />}
      />
      <Tag className="wallet-tag">...</Tag>
    </div>
  );
};
