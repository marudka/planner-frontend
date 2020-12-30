import { useState, useEffect } from 'react';

export type MethodTypeValues = 'POST' | 'PATCH' | 'DELETE' | 'GET';

export const MethodType: { [key in MethodTypeValues]: MethodTypeValues } = {
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  GET: 'GET'
};

export const fetchData = async (url: string, method: MethodTypeValues, body: any) => {
  const requestOptions = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    // @ts-ignore
    requestOptions.body = JSON.stringify(body);
  }

   console.log(requestOptions);
  return await fetch(url, requestOptions).then(response => response.json());
};

export const useFetch = (url: string, method = MethodType.GET, body: any) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!url) return;
    setStatus('fetching');
    fetchData(url, method, body).then((result) => {
      setData(result);
      setStatus('fetched');
    });
  }, [url, method]);

  return { status, data };
};