import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useProvider, useContract, useSigner, useAccount } from 'wagmi';

import BuyMeCoffee from '../abis/BuyMeCoffee.json';

const Home: NextPage = () => {
  const { address: account, isConnecting, isDisconnected } = useAccount();

  const name = useRef() as React.MutableRefObject<HTMLInputElement>;
  const message = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
  const amount = useRef() as any;
  const [memos, setMemos] = useState([]);
  const [owner, setOwner] = useState('');

  const { network } = useProvider();
  const contractAddress = '0xEF25bC6CbF852ee7a39af9855465acDE9330F44E';

  // Get Signer
  const { data: signer, isError, isLoading } = useSigner();
  //Get Provider
  const provider = useProvider();
  //Get Contract
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: BuyMeCoffee.abi,
    signerOrProvider: signer || provider,
  });

  //Buy Coffee
  // change the amount from number to bigNumber
  const buyCoffee = async () => {
    if (contract) {
      const coffeePrice = { value: ethers.utils.parseEther(amount.current.value) };
      const tx = await contract.buyCoffee(name.current.value, message.current.value, coffeePrice);
      await tx.wait();
      getMemos();

      name.current.value = '';
      message.current.value = '';
      amount.current.value = '';
    }
  };

  const withdraw = async () => {
    if (contract) {
      const tx = await contract.withdraw();
      const result = await tx.wait();
      console.log(result);
    }
  };

  //Get all Memos
  const getMemos = async () => {
    if (contract) {
      const memos = await contract.getMemos();
      setMemos(memos);
      console.log(memos);
    }
  };

  const getOwner = async () => {
    if (contract) {
      const owner = await contract.getOwner();
      setOwner(owner);
    }
  };

  useEffect(() => {
    getMemos();
    getOwner();
  }, [contract]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        {/* Tailwind Navbar */}
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <Link href="/">
              <a className="text-sm font-bold text-white mr-4">BUY ME COFFEE</a>
            </Link>
          </div>
          {/* Connect Button at right side */}
          <div className="flex items-center justify-end w-full lg:w-auto">
            <div className="text-sm">
              <ConnectButton />
            </div>
            {/* Withdraw Button */}
            {account == owner && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
                onClick={withdraw}
              >
                Withdraw
              </button>
            )}
          </div>
        </nav>
      </header>
      <section className="py-20 flex items-center justify-center text-center">
        {/* Form with name and message with submit button */}
        <div className="w-full max-w-md">
          <form
            className="bg-white shadow-2xl border border-gray-200 rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              buyCoffee();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                ref={name}
              />
            </div>
            {/* Amound of ETH to Buy coffee | Donation */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                {/* Amount to give */}
                Amount
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="amount"
                type="number"
                min="0.01"
                placeholder="0.01"
                ref={amount}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-h-[150px]"
                id="message"
                placeholder="Message"
                ref={message}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Buy Coffee
              </button>
            </div>
          </form>
          {/* division line */}
          <div className="flex items-center justify-center">
            <div className="border-b w-screen border-gray-300"></div>
            <div className="w-1/5 text-center"></div>
          </div>
          {/* List of messages */}
          <div>
            <ul role="list" className="divide-y divide-gray-200">
              {memos.map((memo: any, i) => (
                <li key={i} className="py-4">
                  <div className="flex space-x-3">
                    <img
                      className="h-6 w-6 rounded-full"
                      src="https://picsum.photos/200/300"
                      alt=""
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{memo.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{memo.message}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
