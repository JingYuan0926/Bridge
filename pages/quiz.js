import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/quiz.module.css'; // Import the CSS module
import FloatingLoginButton from '../components/FloatingLoginButton';


const Quiz = () => {
  const router = useRouter();

  const handleChoiceClick = (choice) => {
    // Navigate to another page based on the choice
    router.push('/complete');
  };

  return (
    <div className={styles['quiz-container']}>
                  <FloatingLoginButton />

      <div className={styles['question-container']}>
        <p>What is the main purpose of having an emergency fund?</p>
      </div>
      <div className={styles['characters-container']}>
        <img src="/gof.gif" alt="Character 1" className={styles.character} />
        <img src="/pirate.gif" alt="Character 2" className={styles.character} />
      </div>
      <div className={styles['choices-container']}>
        <button className={styles.choice} onClick={() => handleChoiceClick('Choice 1')}>A) To pay for vacations</button>
        <button className={styles.choice} onClick={() => handleChoiceClick('Choice 2')}>B) To buy luxury items</button>
        <button className={styles.choice} onClick={() => handleChoiceClick('Choice 3')}>C) To cover unexpected expenses</button>
        <button className={styles.choice} onClick={() => handleChoiceClick('Choice 4')}>D) To invest in stocks</button>
      </div>
    </div>
  );
};

export default Quiz;