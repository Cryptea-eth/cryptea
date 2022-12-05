import dynamic from "next/dynamic";
import { get_request } from "../../../../contexts/Cryptea/requests";

let xd: any;

export const initD = async (link: string, api?: string) => {
  
    xd = (
      (await get_request(`link/${link}`, {
        params: {
          api,
        },
      })) || { data: {} }
    ).data;

    console.log(xd.data, "eor");

    return xd.data;

};

export const template = () => {

  console.log(xd)

  if (Boolean(xd.data)) {
    const { name } = JSON.parse(xd.data.link.template_data);

    return dynamic(() => import(`../../../../templates/${name}`), {
      suspense: true,
    });

  } else {
    return undefined;
  }
};
