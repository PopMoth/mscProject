import React from "react";

interface SummaryViewProps {
  summary: string;
}

export default function SummaryView({ summary }: SummaryViewProps) {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: summary }} />
    </>
  );
}
