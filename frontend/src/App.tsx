import React, { useState, useEffect, ChangeEvent } from 'react';
import './App.css';
import { AnonAadhaarProof, LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import { AnonAadhaarPCD, exportCallDataGroth16FromPCD } from "anon-aadhaar-pcd";
import {ethers} from "ethers";
import pro_voting from "./abi/pro_voting.json";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { SemaphoreProof, generateProof } from "@semaphore-protocol/proof";
import { SemaphoreEthers } from "@semaphore-protocol/data";

function App() {
  const [appState, setAppState] = useState("");
  const [pcd, setPcd] = useState<AnonAadhaarPCD>();
  const [identity, setIdentity] = useState<Identity>();
  const [semaphoreProof, setSemaphoreProof] = useState<SemaphoreProof>();
  const [voteVal, setVoteVal] = useState(0);
  const [anonAadhaar] = useAnonAadhaar();

  let zk3contract: ethers.Contract | null = null;
  let signer = null;
  const provider = new ethers.BrowserProvider(window.ethereum);

  const semaphoreAddress = "0x3889927F0B5Eb1a02C6E2C20b39a1Bd4EAd76131";
  const groupNo = 1004;
  const merkleTreeDepth = 16;
  const externalNullifier = "100";

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
    if (anonAadhaar.status === "logged-in") {
      console.log("Anon Aadhaar pcd: ", anonAadhaar.pcd);
      setPcd(anonAadhaar.pcd);
    }
  }, [anonAadhaar]);

  useEffect(() => {
    if (!identity) {
        const newIdentity = new Identity();
        setIdentity(newIdentity);
        console.log("Generated new identity: ", newIdentity);
    }
}, [identity]);

  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);

  const register = async () => {
    setAppState("registering");
    signer = await provider.getSigner();
    console.log(signer)
    zk3contract = new ethers.Contract("0x7E2D35F3e448784fE4E1B917797c5BB46E5Aa150", pro_voting, signer);
    const { a, b, c, Input } = await exportCallDataGroth16FromPCD(pcd!);
    const tx = await zk3contract.register(identity?.commitment, a, b, c, Input);
    await tx.wait();
    setAppState("registered");
  }

  const vote = async (voteVal:number) => {
    await new Promise(f => setTimeout(f, 5000));
    setAppState("voting");
    console.log("The Identity is: ",identity);
    const semaphoreEthers = new SemaphoreEthers("optimism-goerli", {address: semaphoreAddress});
    console.log("Here")
    const members = await semaphoreEthers.getGroupMembers(groupNo.toString());
    console.log("The members are: ", members);
    const group = new Group(groupNo, merkleTreeDepth, members);
    console.log("The group is: ", group);
    // console.log("args for generate proof: ", identity, group, externalNullifier, userAddrSignal, { zkeyFilePath: "../assets/semaphore.zkey", wasmFilePath: "../assets/semaphore.wasm" });
    console.log("identity: ", identity);
    console.log("group: ", group);
    console.log("externalNullifier: ", externalNullifier);
    // console.log("signal: ", signal);
    // console.log("zkeyFilePath: ", "../assets/semaphore.zkey");
    // console.log("wasmFilePath: ", "../assets/semaphore.wasm");

    const fullProof = await generateProof(identity!, group, externalNullifier, voteVal);
    console.log("The full semaphore proof is: ", fullProof);
    setSemaphoreProof(fullProof);
    const tx = await zk3contract!.vote(fullProof.merkleTreeRoot, fullProof.signal, fullProof.nullifierHash, fullProof.externalNullifier, fullProof.proof);
    await tx.wait();
    setAppState("voted");
  }

  const handleVoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setVoteVal(parseInt(e.target.value));
  };

  return (
    <div className="App">
      <LogInWithAnonAadhaar/>
      <div>
        {anonAadhaar?.status === "logged-in" && appState==="" && (
          <>
            <p>✅ Proof is valid</p>
            <p>Got your Aadhaar Identity Proof</p>
            <>Welcome anon!</>
            <AnonAadhaarProof code={JSON.stringify(anonAadhaar.pcd, null, 2)} />
            <button onClick={register}>Register for Voting</button>
          </>
        )}

        {appState==="registered" && (
          <>
            <p>✅ Registered for voting</p>
            <p>✅ Your identity is registered</p>
            <form onSubmit={() => {vote(voteVal)}}>
              <label>
                Your Vote
                <input
                  type='text'
                  onChange={handleVoteChange}
                  required
                />
              </label><br/>
              <button type='submit'>Cast Vote</button>
            </form>
          </>
        )}

        {appState==="voted" && (
          <>
            <p>✅ Voted Registered. Thanks to be a responsible citizen.</p>
          </>
        )}
      </div>
    </div>
  );
}

// verifier: 0x9f8d0a81BBC02332352a3275b38858fA67FE644B
// anonaadhaar: 0x8DDc79b735fAe47C7D0ed127E52C6312b08230Ee
// zk3: 0x4B6DF5B2399d7ae2e87b610db70A106Bd856617f
// 0xF1aB01eD83C3128E3Af2230A1b99532B943d9348
// 0xb8F1D664F4F9EaBB7eEdEc60842F6a17d72700a7
// 0xd02a26D99D7c2455fCc5a07bEea458E0F1A5Aff3

export default App;
