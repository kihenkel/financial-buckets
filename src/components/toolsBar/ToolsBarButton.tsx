import { CSSProperties } from 'react';
import { ButtonProps, Button } from 'antd';
import Link from 'next/link';

interface ToolsBarButtonProps extends ButtonProps {
  linkHref?: string;
  children: React.ReactNode;
}

const toolsBarButtonStyle: CSSProperties = {
  height: 50,
  fontSize: 20,
};

export const ToolsBarButton = ({ linkHref, children, ...buttonProps }: ToolsBarButtonProps) => {
  if (linkHref) {
    return (
      <Link href={linkHref}>
        <Button block size="large" type="text" style={toolsBarButtonStyle} {...buttonProps}>{children}</Button>
      </Link>
    );
  }
  return (
    <Button block size="large" type="text" style={toolsBarButtonStyle} {...buttonProps}>{children}</Button>
  );
};
