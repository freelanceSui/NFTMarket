import { useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Jazzicon from "@metamask/jazzicon";

// The Jazzicon library takes a diameter in pixels, and a JavaScript integer and returns a colorful, Cubist avatar - this is actually the exact same library and technique that the Uniswap interface uses:
export const Identicon = () => {
  const ref = useRef();
  const { account } = useWeb3React();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return <div ref={ref} />;
};
