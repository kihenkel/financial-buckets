import styles from '@/styles/LoadingIndicator.module.css';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

export const LoadingIndicator = ({ isLoading }: LoadingIndicatorProps) => {
  return (
    <div className={styles.loadingIndicator}>
      {isLoading && <div className={styles.loadingSpinner}><div></div><div></div><div></div><div></div></div>}
      {!isLoading && <div className={styles.tickMark} />}
    </div>
  );
};
