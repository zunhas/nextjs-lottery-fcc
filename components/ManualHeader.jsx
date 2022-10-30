import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
export default function Header() {
  const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading}= useMoralis();
  useEffect(()=>{
    if(isWeb3Enabled) return;
      if(typeof window !== "undefined"){
        if(window.localStorage.getItem("connected")){
          enableWeb3();
        }
      }
  },[isWeb3Enabled]);
  useEffect(()=>{
    Moralis.onAccountChanged((account)=>{
      console.log(`account changed to ${account}`);
      if(account==null){
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    })
  },[]);
    return (      
      <div className="border-b-2 flex flex-row">
        <h1 className="py-4 px-4 font-blog text-3xl">Decentralized Lottery</h1>
        {account?(<div className="ml-auto py-2 px-4">Connected to {account}</div>):
        ( <div className="ml-auto py-2 px-4"><button  className="bg-blue-300 hover:bg-teal-500 text-white font-bold py-2 px-4 round ml-auto" onClick={async()=>{
          await enableWeb3();
          if(typeof window !=="undefined"){
            window.localStorage.setItem("connected","injected");
          }
          
          }} disabled={isWeb3EnableLoading}>Connect</button> </div>)}
      </div>
    );
  }
  