interface RequestErrorProps {
  message: string;
  onRetry: () => void;
}

export default function RequestError({ message, onRetry }: RequestErrorProps) {
  return (
    <div role="alert" className="py-10 text-center">
      <p className="text-red-500">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-lg bg-[#2563eb] px-5 py-3 font-semibold text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
