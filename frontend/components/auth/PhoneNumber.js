import React, { useState } from "react";
import { auth } from '../../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

import {collection, doc, getFirestore, setDoc} from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
auth.settings.appVerificationDisabledForTesting = false;

// PhoneSignup component
const PhoneSignup = () => {
    const countryCode = "+44";
    const [phoneNumber, setPhoneNumber] = useState(countryCode);
    const [expandForm, setExpandForm] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [OTP, setOTP] = useState('');
    const [error, setError] = useState(null);

    // Function to generate reCAPTCHA verifier
    const generateRecaptcha = () => {

        setExpandForm(true);
        window.recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
            size: 'invisible',
            callback: (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    }

    // Function to request OTP
    const requestOTP = async () => {
        if (phoneNumber.length >= 10) {
            try {
                generateRecaptcha();
                let appVerifier = window.recaptchaVerifier;
                const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
                window.confirmationResult = confirmationResult;
            } catch (error) {
                console.error(error);
                setError("Error sending OTP. Please try again.");
            }
        }
    }

    const verifyOTP = async () => {
        try {
            let otp = OTP;

            if (otp.length === 6) {
                let confirmationResult = window.confirmationResult;
                await confirmationResult.confirm(otp);

                // Authentication successful, perform additional actions if needed
                const user = auth.currentUser;
                const firestore = getFirestore();
                const usersCollection = collection(firestore, "users");

                const newUser = {
                    id: user.uid,
                    isOnboarded: false,
                    email: user.email,
                };

                await setDoc(doc(usersCollection, user.uid), newUser);
                console.log("User authenticated:", user);

            } else {
                setError("OTP must be 6 digits");
            }
        } catch (error) {
            console.error(error);
            setError("Error verifying OTP");
        }
    };


    return (
        <div>
            <form onSubmit={requestOTP}>
                <label>
                    Phone Number:
                    <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </label>
                <Button type="button" className="mt-5 bg-black" onClick={requestOTP}>Send Verification Code</Button>

                {expandForm && (

                    <div>
                        <label>
                            Verification Code:
                            <Input type="text" value={OTP} onChange={(e) => setOTP(e.target.value)} />
                        </label>
                        <Button type="button" onClick={verifyOTP}>Verify OTP</Button>
                    </div>

                )}

                <div id="recaptcha-container"></div>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default PhoneSignup;
