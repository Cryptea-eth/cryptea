import axios from 'axios';
import Image from 'next/image';
import { useState, useEffect } from 'react'
import { Skeleton } from '@mui/material';

const cache: { [index: string]: string } = {};

const CustomImg = ({
  alt,
  symbol,
  name,
  size = 40
}: {
  alt: string;
  size?: number;
  name: string;
  symbol: string;
}) => {

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (cache[symbol] === undefined) {

      axios
        .get(`/api/cryptoimg/${name}`, {
          baseURL: window.origin,
        })
        .then((main) => {
          if (Boolean(main.data)) {
            cache[symbol] = main.data;

            setLoading(false);
            
          }
        });
    }
  }, [symbol, name]);

  
  return (
    <>
      {loading && !Boolean(cache[symbol]) ? (
        <Skeleton variant={"circular"} sx={{ width: size, height: size }} />
      ) : (
        <Image layout={"fill"} alt={alt} src={cache[symbol]} />
      )}
    </>
  );
};

export default CustomImg;