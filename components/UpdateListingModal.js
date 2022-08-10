import { React, useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import nftMarketplaceABI from "../abis/NFTMarketplace.json";

const UpdateListingModal = ({
  nftAddress,
  tokenId,
  price,
  onClose,
  isVisible,
  marketplaceAddress,
}) => {
  const [priceToUpdateListing, setPriceToUpdateListing] = useState(0);
  const dispatch = useNotification()
  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplaceABI,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress,
      tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdateListing.toString()) || "0",
    },
  });

  const handleUpdateListingSuccess =async (tx) => {
    await tx.wait(1)
    dispatch({type:"success",message:"Listing updated successfully",title:"listing updated - please refresh (and move blocks)",position:"topR"})
    onClose && onClose()
    setPriceToUpdateListing("0")
  };
  return (
    <Modal
      isVisible={isVisible}
      onOk={() => {
        updateListing({
          onError: (err) => console.log(err),
          onSuccess: () => handleUpdateListingSuccess,
        });
      }}
      onCloseButtonPressed={onClose}
      onCancel={onClose}
    >
      <Input
        onChange={(e) => setPriceToUpdateListing(e.target.value)}
        label="Update Listing Price in L1 Curreny (ETH)"
        name="New Listing price"
        type="number"
      />
    </Modal>
  );
};

export default UpdateListingModal;
