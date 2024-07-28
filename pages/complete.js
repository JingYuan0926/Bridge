import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/complete.module.css'; // Import the CSS module
import FloatingLoginButton from '../components/FloatingLoginButton';

const Quiz = () => {
  const router = useRouter();

  const handleChoiceClick = (choice) => {
    // Navigate to another page based on the choice
    router.push('/complete');
  };

  return (
    <div className={styles.container}>
            <FloatingLoginButton />

      <h1 className={styles.header}>You Win!</h1>
      <img src="/csy1.png" alt="Quiz Image" className={styles.image} />
      <p className={styles.ques}>How's the question given?</p>
      <div className={styles.buttonContainer}>
        <button onClick={() => handleChoiceClick('choice1')} className={styles.button}>Easy</button>
        <button onClick={() => handleChoiceClick('choice2')} className={styles.button}>OK</button>
        <button onClick={() => handleChoiceClick('choice3')} className={styles.button}>Hard</button>
      </div>
    </div>
  );
};

export default Quiz;