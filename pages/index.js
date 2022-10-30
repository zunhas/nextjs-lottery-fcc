import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import ManualHeader from "../components/ManualHeader";
import Header from "../components/ManualHeader";
import LotteryEntrance from "../components/LotteryEntrance";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Our smart contract lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManualHeader />
      {/* <Header />*/}
      <LotteryEntrance />
    </div>
  );
}
