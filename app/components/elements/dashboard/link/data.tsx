import dynamic from "next/dynamic";
import { get_request } from "../../../../contexts/Cryptea/requests";

let xd: any;

export const initD = async (link: string, api?: string, renew?: string) => {
  
    xd = (
      (await get_request(`link/${link}`, {
        params: {
          api, renew
        },
      })) || { data: {} }
    ).data;

    return xd.data;
};

export const template = () => {

  if (Boolean(xd.data.link.template_data)) {
    
    const { name } = JSON.parse(xd.data.link.template_data);

    return dynamic(() => import(`../../../../templates/${name}`), {
      suspense: true,
    });

  } else {
    return undefined;
  }
};
