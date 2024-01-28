import { useState, useEffect, useRef } from 'react';

export function useDebounce(valorInput, delay = 500) {
  const [valor, setValor] = useState('');
  const timeout = useRef(null);

  useEffect(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => 
      setValor(valorInput)
    , delay);
  }, [valorInput]);

  return valor;
}
