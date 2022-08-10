import React, { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceABI from "../abis/NFTMarketplace.json";
import UpdateListingModal from "./UpdateListingModal";
import basicNFTABI from "../abis/BasicNFT.json";
import Image from "next/image";
import { Card,useNotification } from "web3uikit";
import { ethers } from "ethers";

const truncateString = (str, len) => {
  if (str.length <= len) return str;
  const seperator = "...";
  let sepLength = seperator.length;
  const charsToShow = len - sepLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    str.substring(0, frontChars) +
    seperator +
    str.substring(str.length - backChars)
  );
};

const NFTBox = ({ price, tokenId, nftAddress, seller, marketplaceAddress }) => {
  const [tokenUri, setTokenUri] = useState({});
  const [showModal,setShowModal]=useState(false);
  const dispatch=useNotification()
  const { isWeb3Enabled, account } = useMoralis();
  const { runContractFunction: getTokenUri } = useWeb3Contract({
    abi: basicNFTABI,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const {runContractFunction:buyItem}=useWeb3Contract({
    abi:nftMarketplaceABI,contractAddress:marketplaceAddress,
    functionName:"buyItem",
    msgValue:price,
    params:{
      nftAddress,tokenId
    }
  })
  const updateUI = async () => {
    const tokenURI = await getTokenUri();
    if (tokenURI) {
      const tokenURIResponse = await (await fetch(tokenURI)).json();
      setTokenUri(tokenURIResponse);
    }
  };

  useEffect(() => {
    if (isWeb3Enabled) updateUI();
  }, [isWeb3Enabled]);

  const isOwnedByUser = seller === account;
  const formattedSeller = isOwnedByUser ? "You" : truncateString(seller, 15);

  const handleCardClick=()=>{
    isOwnedByUser ? setShowModal(true) : buyItem({
      onError:err=>console.log(err),
      onSuccess:handleBuyItemSuccess
    })
  }

  const handleBuyItemSuccess=async(tx)=>{
    await tx.wait(1)
    dispatch({type:"success",message:"Item Bought",title:"Item Bought",position:"topR"})

  }

  return (
    <div>
      <div>
        {tokenUri.image ? (
          <div>
            <UpdateListingModal isVisible={showModal} price={price}  tokenId={tokenId} nftAddress={nftAddress} marketplaceAddress={marketplaceAddress} onClose={()=>setShowModal(false)}/>
            <div>
              <Card title={tokenUri.name} description={tokenUri.description} onClick={handleCardClick}>
                <div className="p-2">
                  <div className="flex flex-col items-end gap-2">
                    <div>#{tokenId}</div>
                    <div className="italic text-sm">
                      Owned by {formattedSeller}
                    </div>
                    <Image
                      loader={() => tokenUri.image}
                      src={tokenUri.image}
                      height={200}
                      width={200}
                    />
                    <div className="font-bold">
                      Price {ethers.utils.formatEther(price)} ETH
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div>Loading</div>
        )}
      </div>
    </div>
  );
};

export default NFTBox;
