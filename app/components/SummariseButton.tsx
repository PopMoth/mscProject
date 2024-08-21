interface SummariseButtonProps {
  disabled: boolean;
  onClick: () => void;
  isLoading: boolean;
}

export default function SummariseButton({
  disabled,
  onClick,
  isLoading,
}: SummariseButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
        disabled ? "bg-gray-500" : "hover:bg-blue-700"
      }`}
    >
      {isLoading ? "Loading" : "Summarise"}
    </button>
  );
}

//  className="disabled:cursor-not-allowed relative inline-flex align-middle justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600
//        to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
//
