import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/complete.module.css'; // Import the CSS module
import FloatingLoginButton from '../components/FloatingLoginButton';
import TransferFunds from '../components/TransferFund'; // Import the TransferFunds component

const Quiz = () => {
  const router = useRouter();
  const [zkLoginUserAddress, setZkLoginUserAddress] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);

  const handleChoiceClick = (choice) => {
    // Display the TransferFunds component
    setShowTransfer(true);
  };

  const handleTransferComplete = () => {
    // Navigate to another page after transfer
    router.push('/complete');
  };

  const handleLogin = (address) => {
    setZkLoginUserAddress(address);
  };

  return (
    <div className={styles.container}>
      <FloatingLoginButton onLogin={handleLogin} />

      <h1 className={styles.header}>You Win!</h1>
      <img src="/csy1.png" alt="Quiz Image" className={styles.image} />
      <p className={styles.ques}>How's the question given?</p>
      <div className={styles.buttonContainer}>
        <button onClick={() => handleChoiceClick('choice1')} className={styles.button}>Easy</button>
        <button onClick={() => handleChoiceClick('choice2')} className={styles.button}>OK</button>
        <button onClick={() => handleChoiceClick('choice3')} className={styles.button}>Hard</button>
      </div>
      
      {showTransfer && zkLoginUserAddress && (
        <TransferFunds userAddress={zkLoginUserAddress} onTransferComplete={handleTransferComplete} />
      )}
    </div>
  );
};

export default Quiz;
