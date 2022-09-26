import dynamic from "next/dynamic";

let xd: any;

export const initD = async (link: string) => {
  
   xd = await (`links/${link}`).get('*', true);

   console.log(xd)

  return xd.data;
};

export const template = () => {

  if (xd.data.link.template_data !== undefined) {
    const { name } = JSON.parse(xd.data.link.template_data);

    return dynamic(() => import(`../../../../templates/${name}`), {
      suspense: true,
    });

  } else {
    return undefined;
  }
};
