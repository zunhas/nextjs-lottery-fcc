import { useWeb3Contract } from "react-moralis";
import {abi, contractAddresses} from "../constants"
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import {ethers} from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
    const [entranceFee, setEntranceFee]=useState("0");
    const [numberOfPlayers, setNumberOfPlayers]=useState("0");
    const [recentWinner, setRecentWinner]=useState("0");


    //chainId also will give hex version of chain id
    const {chainId:chainIdHex, isWeb3Enabled} = useMoralis();
    const chainId= parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses? contractAddresses[chainId][0]:null;

    const dispatch = useNotification();

    const { runContractFunction:enterRaffle, isLoading, isFetching} =useWeb3Contract({
        abi:abi,
        contractAddress: raffleAddress,
        functionName:"enterRaffle",
        params:{},
        msgValue:entranceFee,
    });

    const { runContractFunction:getEntranceFee} =useWeb3Contract({
        abi:abi,
        contractAddress: raffleAddress,
        functionName:"getEntranceFee",
        params:{},
    });
    const { runContractFunction:getNumberOfPlayers} =useWeb3Contract({
        abi:abi,
        contractAddress: raffleAddress,
        functionName:"getNumberOfPlayers",
        params:{},
    });
    const { runContractFunction:getRecentWinner} =useWeb3Contract({
        abi:abi,
        contractAddress: raffleAddress,
        functionName:"getRecentWinner",
        params:{},
    });

    async function updateUI(){
        if(raffleAddress!=null){
        const entranceFeeFromCall =(await getEntranceFee()).toString();
        setEntranceFee(entranceFeeFromCall);
        const playersFromCall =(await getNumberOfPlayers()).toString();
        setNumberOfPlayers(playersFromCall);
        const recentWinnerFromCall =await getRecentWinner();
        setRecentWinner(recentWinnerFromCall);
        }
    }

    useEffect(()=>{
        if(isWeb3Enabled){
            // read entrance fee
            updateUI();
        }
    },[isWeb3Enabled]);

    const handleSuccess = async function(tx){
        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
    }
    const handleNewNotification = function(){
        dispatch({type:"info", message:"Transcation Complete!", title:"Tx Notification", position:"topR", icon:"bell"});
    }
    return(<div className="p-5">
        {raffleAddress?<div>
        <button className="bg-blue-300 hover:bg-teal-500 text-white font-bold py-2 px-4 round ml-auto"
         onClick={async function(){await enterRaffle({onSuccess:handleSuccess,onError:(error)=>console.log(error)});}} disabled={isLoading||isFetching}>
           {isLoading||isFetching?<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>:<div>Enter Raffle</div>}
        </button>
        <div> Entrance fee for lottery is {ethers.utils.formatUnits(entranceFee,"ether")} ETH!</div>
        <div>Number of Players {numberOfPlayers}</div>
        <div>Recent winner {recentWinner}</div>
        </div>:<div>No Raffle address detected </div>}
       
    </div>)
}