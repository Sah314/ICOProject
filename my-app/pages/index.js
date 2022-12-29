import { BigNumber, Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import {
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";
import styles from '../styles/Home.module.css'


export default function Home() {
  const zero = BigNumber.from(0);
const [walletConnected,setWalletConnected]=useState(false);
const [tokensMinted,setTokensMinted] = useState(zero);
const [balanceofTokens,setBalanceofTokens] = useState(zero);
const [loading,setLoading] = useState(false);
const [tokenAmount,setTokenAmount] = useState(zero);
const [tokensToBeClaimed,setTokensToBeClaimed] = useState(zero);
const web3ModalRef = useRef();


const getProviderOrSigner=async(needSigner=false)=>{
const provider = await web3ModalRef.current.connect();
const web3Provider = new providers.Web3Provider(provider);
const {chainId} = await web3Provider.getNetwork();
if(chainId!==5){
  window.alert("Please change the network to Goerli!");
  throw new Error("Change the network to Goerli");
}
if(needSigner){
  const signer = web3Provider.getSigner();
  return signer;
}
return web3Provider;
};
const connectWallet = async()=>{
  try {
    await getProviderOrSigner();
    setWalletConnected(true);

  } catch (err) {
    console.error(err)
  }
};

const getBalanceofTokens = async()=>{
  try {
    const provider = await getProviderOrSigner();
    const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,provider);
    const signer = await getProviderOrSigner(true);
    const address = signer.getAddress();
    const balance = await tokenContract.balanceOf(address);
    setBalanceofTokens(balance);
    console.log("set balance");
  } catch (err) {
    console.error(err)
  }
};
const getTotalTokensMinted = async()=>{
  const provider = await getProviderOrSigner();
  const tokenContract = new Contract(
    TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,provider);
    const _tokensMinted = await tokenContract.totalSupply();
    setTokensMinted(_tokensMinted);
  };

const getTokensToBeClaimed = async()=>{

  try {
    const provider = await getProviderOrSigner();
    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS,NFT_CONTRACT_ABI,provider
      );
      const signer=  await getProviderOrSigner(true);
      const address = await signer.getAddress();
      const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,provider);
  const balance = await nftContract.balanceOf(address);
  if(balance === zero){
    setTokensToBeClaimed(zero);
  }
  else{
  var amt=0;
  for(var i=0;i<balance;i++){
    const tokenId = await nftContract.tokenOfOwnerByIndex(address,i);
    const claimed = await tokenContract.tokenIdsClaimed(tokenId); 
    if(!claimed){
      amt+=1;
    }
  }
  setTokensToBeClaimed(BigNumber.from(amt));  
  console.log("set total minted tokens");
  }
  } catch (err) {
    console.error(err);
    setTokensToBeClaimed(zero);
  }
  
};

const mintCryptoToken = async(amount)=>{
  try {
    const signer = await getProviderOrSigner(true);
    const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,signer);
    const value = 0.001*amount; 
    const tx = await tokenContract.mint(amount,{value: utils.parseEther(value.toString()),});
    setLoading(true);
    await tx.wait();
    setLoading(false);
    window.alert("Successful in minting a 'THE' Token");
    await getBalanceofTokens();
    await getTotalTokensMinted();
    await getTokensToBeClaimed();
  } catch (err) {
    console.error(err);
  }
};
const claimTokens = async()=>{
  try {
    const signer = await getProviderOrSigner(true);
    const tokenContract =  new Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,signer);
    
    const tx = await tokenContract.claim();
    console.log("hello");
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("Successfully claimed Tokens");
      await getBalanceofTokens();
      await getTotalTokensMinted();
      await getTokensToBeClaimed();
  } catch (err) {
    console.error(err)
  }
};
const renderButton =() =>{
if(loading){
  return(
    <div>
      <button className={styles.button}>Loading.....</button>
    </div>
  );
}
if(tokensToBeClaimed>0){  
  return(
    <div>
    <div className={styles.description}>{tokensToBeClaimed *10} Tokens can be claimed!</div>
  <button className={styles.button} onClick={claimTokens}>Claim Tokens</button>
  </div>
  );
}
  return(
    <div style={{display:"flex-col"}}>
      <div>
        <input type="number" placeholder="Amount of Tokens" onChange ={(e)=> setTokenAmount(BigNumber.from(e.target.value))} />
      <button className={styles.button} disabled={!(tokenAmount >0)} onClick={()=>mintCryptoToken(tokenAmount)}> Mint Tokens</button>
      
      </div>
    </div>
    );
}

useEffect(()=>{
  if(!walletConnected){
web3ModalRef.current = new Web3Modal({
  network:"goerli",
  providerOptions:{},
  disableInjectedProvider:false,
}); 
connectWallet();
getBalanceofTokens();
getTotalTokensMinted();
getTokensToBeClaimed();
  }
});

 return(
  <div>
    <Head>
    <title>Crypto ICO Project</title>
    <meta name="Description" content="ICO Dapp"/>
    <link rel="icon" href="./favicon.ico" />
    </Head>
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>Welcome to <strong>THE</strong>  ICO</h1>
        <div className={styles.description}>
          You can claim or mint <strong>the</strong>  tokens here
        </div>
        {
          walletConnected ?(
            <div>
              <div className={styles.description}>
                You have minted {utils.formatEther(balanceofTokens)} number of tokens
              </div>
              <div className={styles.description}>
              {utils.formatEther(tokensMinted)}/10000 number of tokens have been minted;
              </div>
              {renderButton()}
            </div>
          )
          : (<button onClick={connectWallet} className={styles.button}>Connect to Wallet</button>)
        }
      </div>
    <div>
      <img className={styles.image} src="./0.svg" alt="No image available"/>
    </div>
    </div>
    <footer className={styles.footer}> Made with &#10084;</footer>
   </div>
 )
}
