"use client"
import AuthModal from "@/components/auth/AuthModal";
import {useState} from "react";


export default function Home() {

    const [showModal, setShowModal] = useState(true);

    return (
        <div>
            <button onClick={() => setShowModal(true)}>Get started</button>
            {showModal && <AuthModal onClose={() => setShowModal(false)}/>}
    </div>
  );
}




