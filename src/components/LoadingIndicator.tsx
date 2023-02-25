import { CloudSyncOutlined } from '@ant-design/icons';
import styles from '@/styles/LoadingIndicator.module.css';
import { Button } from 'antd';

interface LoadingIndicatorProps {
  isLoading: boolean;
  isStale: boolean;
  onStaleClicked(): void;
}

export const LoadingIndicator = ({ isLoading, isStale, onStaleClicked }: LoadingIndicatorProps) => {
  return (
    <div className={styles.loadingIndicator}>
      {isLoading && <div className={styles.loadingSpinner}><div></div><div></div><div></div><div></div></div>}
      {!isLoading && !isStale && <div className={styles.tickMark} />}
      {isStale && !isLoading && (
        <Button className={styles.staleButton} onClick={onStaleClicked} size="large" type="text">
          <CloudSyncOutlined className={styles.staleIcon} />
        </Button>
      )}
    </div>
  );
};
