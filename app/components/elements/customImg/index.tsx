import axios from 'axios';
import Image from 'next/image';
import { useState, useEffect } from 'react'
import { Skeleton } from '@mui/material';

const cache: { [index: string]: string } = {};

const CustomImg = ({
  alt,
  symbol,
  key,
  name,
  size = 40
}: {
  alt: string;
  size?: number;
  key: number;
  name: string;
  symbol: string;
}) => {

  const [loading, setLoading] = useState<boolean>(true);

  const mName = name.toLowerCase();

  useEffect(() => {
    if (cache[mName] === undefined) {
      axios
        .get(`/api/cryptoimg/${mName}`, {
          baseURL: window.origin,
        })
        .then((main) => {
          if (Boolean(main.data)) {
            cache[mName] = main.data;

            setLoading(false);
          }
        });
    }
  }, [symbol, mName]);

  
  return (
    <>
      {loading && !Boolean(cache[mName]) ? (
        <Skeleton variant={"circular"} sx={{ width: size, height: size }} />
      ) : (
       
          <Image layout={"fill"} alt={alt} src={cache[mName]} />
    
      )}
    </>
  );
};

export default CustomImg;