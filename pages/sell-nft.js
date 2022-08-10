import React from "react";
import { Form,useNotification } from "web3uikit";
import {ethers} from "ethers"
import nftABI from "../abis/BasicNFT.json"
import NFTMarketplaceABI from "../abis/NFTMarketplace.json"
import { useWeb3Contract } from "react-moralis";

const SellNFT = () => {
  const dispatch= useNotification()
  
  const {runContractFunction}=useWeb3Contract()
  const approveAndList=async(data)=>{
    const nftAddress = data.data[0].inputResult
    const tokenId = data.data[1].inputResult
    const price =ethers.utils.parseUnits( data.data[2].inputResult,"ether").toString()
    const marketplaceAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    const approveOptions = {
      
      abi:nftABI,
      contractAddress:nftAddress,
      functionName:"approve",
      params:{
        to:marketplaceAddress,
        tokenId:tokenId
      }
    }

    await runContractFunction({
      params:approveOptions, onError:err=>console.log(err),
      onSuccess: ()=>handleApproveSuccess(nftAddress,tokenId,price)
    })
  }

  const handleApproveSuccess=async(nftAddress,tokenId,price)=>{
    const marketplaceAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

        const listOptions = {
          abi:NFTMarketplaceABI,
          contractAddress:marketplaceAddress,
          functionName:"listItem",
          params:{
            nftAddress,tokenId,price
          }
        }

        await runContractFunction({
          params:listOptions, onError:err=>console.log(err),onSuccess:handleListSuccess
        })
  }

  const handleListSuccess=async()=>{
    dispatch({type:"success",message:"NFT Listing",title:"NFT Listed",position:"topR"})
  }
  return (
    <div>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: "NFT Address",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "nftAddress",
          },

          { name: "tokenId", type: "number", value: "", key: "tokenId" },
          {
            name: "Price",
            type: "number",
            value: "",
            key: "price",
          },
        ]}

        title="Sell your nft"
        id="Main Form"
     />
    </div>
  );
};

export default SellNFT;
