import { useEffect, useState } from "react";

interface RequestState<T> {
  data: T | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function useApiRequest<T>(
  load: () => Promise<T>,
  error: string | ((error: unknown) => string),
) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    isLoading: true,
    errorMessage: null,
  });

  useEffect(() => {
    let ignore = false;

    async function run() {
      try {
        const data = await load();

        if (!ignore) {
          setState({
            data,
            isLoading: false,
            errorMessage: null,
          });
        }
      } catch (cause) {
        if (!ignore) {
          setState({
            data: null,
            isLoading: false,
            errorMessage: typeof error === "string" ? error : error(cause),
          });
        }
      }
    }

    void run();

    return () => {
      ignore = true;
    };
  }, [load, error, attempt]);

  function retry() {
    setState({
      data: null,
      isLoading: true,
      errorMessage: null,
    });

    setAttempt((value) => value + 1);
  }

  return { ...state, retry };
}
