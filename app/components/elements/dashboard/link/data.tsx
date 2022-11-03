import dynamic from "next/dynamic";

let xd: any;

export const initD = async (link: string) => {
  
   xd = await (`links/${link}`).get('*', true);

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
