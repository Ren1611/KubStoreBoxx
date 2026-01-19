import React from "react";
import { useTranslation } from "../../hooks/useTranslation";

export const TransText = ({
  children,
  values,
  component: Component = "span",
  ...props
}) => {
  const { translate } = useTranslation();

  if (!children) return null;

  const translatedText = translate(children, values);

  return <Component {...props}>{translatedText}</Component>;
};

export const TransH1 = (props) => <TransText component="h1" {...props} />;
export const TransH2 = (props) => <TransText component="h2" {...props} />;
export const TransH3 = (props) => <TransText component="h3" {...props} />;
export const TransP = (props) => <TransText component="p" {...props} />;
export const TransButton = (props) => (
  <TransText component="button" {...props} />
);
export const TransLabel = (props) => <TransText component="label" {...props} />;
export const TransSpan = (props) => <TransText component="span" {...props} />;
