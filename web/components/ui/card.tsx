import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: CardSectionProps) {
  return (
    <div className={`border-b border-slate-100 p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: CardSectionProps) {
  return (
    <h3 className={`text-xl font-semibold text-slate-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: CardSectionProps) {
  return (
    <p className={`mt-2 text-sm text-slate-600 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
}: CardSectionProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
}: CardSectionProps) {
  return (
    <div className={`border-t border-slate-100 p-6 ${className}`}>
      {children}
    </div>
  );
}

export default Card;