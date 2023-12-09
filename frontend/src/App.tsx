import React, { useState, useEffect } from 'react';
import './App.css';
import { AnonAadhaarProof, LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import { AnonAadhaarPCD, exportCallDataGroth16FromPCD } from "anon-aadhaar-pcd";
import {ethers} from "ethers";
import pro_voting from "./abi/pro_voting.json";
import { Identity } from "@semaphore-protocol/identity";

function App() {
  const [appState, setAppState] = useState("");
  const [pcd, setPcd] = useState<AnonAadhaarPCD>();
  const [identity, setIdentity] = useState<Identity>();
  const [anonAadhaar] = useAnonAadhaar();

  let zk3contract = null;
  let signer = null;
  const provider = new ethers.BrowserProvider(window.ethereum);

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

  const register = async () => {
    setAppState("registering");
    signer = await provider.getSigner();
    console.log(signer)
    zk3contract = new ethers.Contract("0x4B6DF5B2399d7ae2e87b610db70A106Bd856617f", pro_voting, signer);
    const { a, b, c, Input } = await exportCallDataGroth16FromPCD(pcd!);
    const tx = await zk3contract.register(identity?.commitment, a, b, c, Input);
    await tx.wait();
    setAppState("registered");
  }

  // const vote = async () => {
  //   setAppState("voting");

  // }

  return (
    <div className="App">
      <LogInWithAnonAadhaar/>
      <div>
        {anonAadhaar?.status === "logged-in" && appState!=="registered" && (
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
            {/* <form onSubmit={vote}>
              <button type='submit'>Cast Vote</button>
            </form> */}
          </>
        )}
      </div>
    </div>
  );
}

// verifier: 0x9f8d0a81BBC02332352a3275b38858fA67FE644B
// anonaadhaar: 0x8DDc79b735fAe47C7D0ed127E52C6312b08230Ee
// zk3: 0x4B6DF5B2399d7ae2e87b610db70A106Bd856617f

export default App;
