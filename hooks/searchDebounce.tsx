import { useEffect, useState } from "react";


const useSearchDebounce = (value: string, delay: number = 1000) => {
  const [searchDebounce, setSearchDebounce] = useState("");

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSearchDebounce(value);
    }, delay);

    return () => {
      clearTimeout(timeOut);
    };
  }, [value]);

  return searchDebounce;
};

export default useSearchDebounce;
