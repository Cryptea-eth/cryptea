import dynamic from 'next/dynamic';
import Moralis from 'moralis'

let xd: any;


export const initD = async (link:string) => {
    Moralis.start({
      serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVER,
      appId: process.env.NEXT_PUBLIC_MORALIS_APP_ID,
    });

    
      const initS = Moralis.Object.extend("link");

      const mQ = new Moralis.Query(initS);

      mQ.equalTo("link", link);

      xd = await mQ.first();

      return xd;
}

export const template = () => {

    if(xd.get('template_data') !== undefined){
    
        const { name } = JSON.parse(xd.get("template_data"));

        return dynamic(() => import(`../../../../templates/${name}`), {
            suspense: true,
        });

    }else{
        return undefined;
    }
}