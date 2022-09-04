
const onetype: string[] = ["onetime", "single", "onlyone"]; //allowed types

const subtype: string[] = [
  "subscription",
  "multiple",
  "single",
  "sub",
  "interval",
  "double",
];

export const types: string[] = [...onetype, ...subtype];

export const defineType = (type: string) => {
    if (subtype.indexOf(type) != -1) {
        return 'sub';
    }else if(onetype.indexOf(type) != -1){
        return 'onetime';
    }
    
    return false;
}