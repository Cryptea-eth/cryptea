import axios from 'axios';
import { CrypteaDBS, CrypteaSub } from './types';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://ap.cryptea.me";



const init = (path: string) => {
    const config = {
        headers: {
            'Authorization': `Bearer `
        },
    }

    axios.get(`/`, config);
}

const getKey = (key: string, obj: {[index: string]: any}): string | undefined => {
    for (let ix in obj) {
        if ((ix).toLowerCase() == (key).toLowerCase()) {
            return obj[ix];
        }else if(typeof obj[ix] == 'object'){
            return getKey(key, obj[ix]);
        } 
    }
}

// export const time = () => axios.get(`/time`, { params: { timezone: jstz.determine().name() } });

const allowed: CrypteaDBS = {
  links: { supports: ["get", "all", "delete", "id"], endpoint: "/link" },

  user: { supports: ["get", "all"], endpoint: "/user" },

  payments: {
    supports: ["get", "all", "id", "idrequire"],
    endpoint: "/link/payments/",
  },
  views: {
    supports: ["get", "all", "id", "idrequire"],
    endpoint: "/link/views/",
  },
  templates: {
    supports: ["get", "all"],
    endpoint: "/template",
  },
};

const headers =  {
        accept: 'application/json',
        "Content-Type": "application"
    }

String.prototype.get = async function (this:string, column: string, fresh: boolean = false) {
    const pstring:string[] = this.split('/');

    let allowP: CrypteaSub | undefined;

    for (let index in allowed) {
        const dax = allowed[index].supports.indexOf('get') 
        if (dax != -1) {  
            if (
              (allowed[index].supports.indexOf("idrequire") != -1 &&
                pstring[1] !== undefined) ||
              (allowed[index].supports.indexOf("idrequire") == -1)
            ) {
              if (pstring[0].toLowerCase() == index.toLowerCase()) {
                allowP = allowed[index];
                break;
              }
            }
        }
    }

    if (allowP !== undefined) {
        const extra = pstring[1] !== undefined ? pstring[1] : '';
        const cache = localStorage.getItem((pstring[0]).toLowerCase()) 
        
        const rcache = JSON.parse(cache ?? '{}');

        if (fresh || cache === null) {
           const res = await axios.get(`${allowP.endpoint}${extra}`, {
                headers
            });

            const { data } = res;

           if (!data.error || data.error == undefined) {
            
                localStorage.setItem(pstring[0].toLowerCase(), JSON.stringify(data));

                return getKey(column, data);
           }

        }else{
            return getKey(column, rcache);
        }
    }


    return undefined
}


String.prototype.save = async (table: Object) => {
  return true;
};

String.prototype.delete = async (id: number) => {
  return true;
};


