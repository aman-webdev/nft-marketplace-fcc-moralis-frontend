import Image from "next/image";
import { useMoralis, useMoralisQuery } from "react-moralis";
import NFTBox from "../components/NFTBox";

export default function Home() {
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId")
  );
  const { isWeb3Enabled } = useMoralis();

  return (
    <div className="mx-auto container">
      <h1 className="p-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap w-full gap-4 ">
        {
        isWeb3Enabled ? (
        fetchingListedNfts ? (
          <div>Loading....</div>
        ) : (
          listedNfts.map((nft) => {
            console.log(nft.attributes);
            const { price, nftAddress, tokenId, marketplaceAddress, seller } =
              nft.attributes;
            return <NFTBox {...nft.attributes} key={tokenId} />;
          })
        )) : null}
      </div>
    </div>
  );
}
