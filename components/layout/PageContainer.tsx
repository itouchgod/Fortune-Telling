import type { ReactNode } from "react";

interface PageContainerProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function PageContainer({ title, description, actions, children }: PageContainerProps) {
  return (
    <div className="mx-auto min-h-[calc(100vh-137px)] max-w-7xl px-4 py-6 md:py-8">
      {(title || description || actions) && (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            {title && <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">{title}</h1>}
            {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
