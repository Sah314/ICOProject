import { BigNumber, Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
// import {
//   NFT_CONTRACT_ABI,
//   NFT_CONTRACT_ADDRESS,
//   TOKEN_CONTRACT_ABI,
//   TOKEN_CONTRACT_ADDRESS,
// } from "../constants";
import styles from '../styles/Home.module.css'


export default function Home() {
const [walletConnected,setWalletConnected]=useState(false);

const web3ModalRef = useRef();

const connectWallet = async()=>{
  try {

    setWalletConnected(true);

  } catch (err) {
    console.error(err)
  }
}

useEffect(()=>{
  if(!walletConnected){
web3ModalRef.current = new Web3Modal({
  network:"goerli",
  providerOptions:{},
  disableInjectedProvider:false,
}); 
connectWallet();
  }
})

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
      </div>
    </div>
   </div>
 )
}
