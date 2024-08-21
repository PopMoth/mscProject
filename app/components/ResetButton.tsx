interface ResetButtonProps {
  onClick: () => void;
}

export default function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded`}
      onClick={onClick}
    >
      Reset
    </button>
  );
}
