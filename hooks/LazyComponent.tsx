import React, { Suspense, useState, useEffect, ComponentType, ReactNode } from 'react';

type DynamicImportProps = {
  loader: () => Promise<{ default: ComponentType<any> } | ComponentType<any>>;
  loading?: ReactNode;
};

function DynamicImport({ loader, loading: Loading = null }: DynamicImportProps) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loader()
      .then(comp => {
        setComponent(() => ("default" in comp ? comp.default : comp));
      })
      .catch(err => {
        console.error('Failed to load component:', err);
        setError(err);
      });
  }, [loader]);

  if (error) {
    return <div>Error loading component: {error.message}</div>;
  }

  if (!Component) {
    return <>{Loading}</>;
  }

  return <Component />;
}

type LazyComponentProps = {
  componentPath: string;
};

const LazyComponent: React.FC<LazyComponentProps> = ({ componentPath }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <DynamicImport
      loader={() => import(`@/components/${componentPath}`)}
      loading={<div>Custom loading state...</div>}
    />
  </Suspense>
);

export default LazyComponent;
