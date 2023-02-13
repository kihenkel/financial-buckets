import React, { CSSProperties } from 'react';
import { Card } from 'antd';
import type { CardProps } from 'antd';

interface BucketShellProps extends CardProps {
  children: React.ReactNode;
}

const cardStyle: CSSProperties = {
  width: 256,
  maxWidth: 256,
};

export const BucketShell = ({ children, ...cardProps }: BucketShellProps) => {
  return (
    <Card {...cardProps} bordered={false} style={{ ...cardStyle, ...cardProps.style }}>
      {children}
    </Card>
  );
};
