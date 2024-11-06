import { CSSProperties, PropsWithChildren, useMemo } from 'react';

export interface LayoutProps extends PropsWithChildren {
  gap?: number;
  justify?: CSSProperties['justifyContent'];
  align?: CSSProperties['alignContent'];
}

export const Stack = ({
  gap = 16,
  justify = 'flex-start',
  align = 'flex-start',
  children
}: LayoutProps) => {
  const style: CSSProperties = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: justify,
    alignContent: align,
    gap: gap,
  }), [justify, align, gap]);

  return <div style={style}>{children}</div>;
};

export const Row = ({
  gap = 16,
  justify = 'flex-start',
  align = 'flex-start',
  children
}: LayoutProps) => {
  const style: CSSProperties = useMemo(() => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: justify,
    alignContent: align,
    gap: gap,
  }), [justify, align, gap]);

  return <div style={style}>{children}</div>;
};
