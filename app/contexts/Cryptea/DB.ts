import { AxiosError } from "axios";
import {
  del_request,
  post_request,
  get_request,
  patch_request,
} from "./requests";
import { CrypteaDBS, CrypteaSub } from "./types";

const getKey = (
  key: string,
  obj: { [index: string]: any }
): string | undefined => {
  for (let ix in obj) {
    if (ix.toLowerCase() == key.toLowerCase()) {
      return obj[ix];
    } else if (typeof obj[ix] == "object") {
      const obx = getKey(key, obj[ix]);

      if (obx !== undefined) return obx;
    }
  }
};

export const time = async () =>
  await (
    ((await get_request(
      `/time`,
      {
        params: { timezone: window?.jstz?.determine?.()?.name?.() },
      },
      undefined,
      false
    )) as any) || { data: undefined }
  ).data;

const allowed: CrypteaDBS = {
  links: {
    supports: ["get", "delete", "save", "id", "update"],
    endpoint: "/link",
  },

  user: { supports: ["get", "update"], endpoint: "/user" },

  payments: {
    supports: ["get", "id", "save", "saveid", "idrequire"],
    endpoint: "/link/payments",
  },
  views: {
    supports: ["get", "id", "save", "idrequire"],
    endpoint: "/link/views",
  },
  templates: {
    supports: ["get"],
    endpoint: "/templates",
  },
};

const headers = {
  accept: "application/json",
  "Content-Type": "application",
};

const getSupport = (
  proto: string,
  supports: "get" | "delete" | "update" | "save",
  id?: number | string
): [CrypteaSub | undefined, string[]] => {
  const pstring: string[] = proto.split("/");

  if (pstring[1] === undefined && id !== undefined) pstring[1] == id;

  let allowP: CrypteaSub | undefined;

  for (let index in allowed) {
    const { supports: support } = allowed[index];
    const dax = support.indexOf(supports);
    if (dax != -1) {
      if (
        (support.indexOf("idrequire") != -1 && pstring[1] !== undefined) ||
        (supports == "save" && support.indexOf("saveid") != -1) ||
        support.indexOf("idrequire") == -1
      ) {
        if (pstring[0].toLowerCase() == index.toLowerCase()) {
          allowP = allowed[index];
          break;
        }
      }
    }
  }

  return [allowP, pstring];
};

String.prototype.get = async function (
  this: string,
  column: string,
  fresh: boolean | undefined = false,
  id?: number | string
) {
  const [allowP, pstring]: [CrypteaSub | undefined, string[]] = getSupport(
    this,
    "get",
    id
  );

  if (allowP !== undefined) {
    const extra = pstring[1] !== undefined ? "/" + pstring[1] : "";
    const cache = localStorage.getItem(pstring[0].toLowerCase());

    const rcache = JSON.parse(cache ?? "{}");

    if (fresh || cache === null) {
      try {
      const res: any = await get_request(`${allowP.endpoint}${extra}`, {
        params: { tz: window?.jstz?.determine?.()?.name?.() },
      });

      const { data } = res || { data: { error: true } };

      if (!data.error || data.error == undefined) {
        localStorage.setItem(pstring[0].toLowerCase(), JSON.stringify(data));

        if (column == "*") {
          return data;
        } else {
          return getKey(column, data);
        }
      }else{
          return data;
      }

      } catch (err) {

        throw err;
      }

    } else {
      if (column == "*") {
        return rcache;
      } else {
        return getKey(column, rcache);
      }
    }
  }

  return undefined;
};

String.prototype.update = async function (
  this: string,
  obj: Object,
  id?: number
) {
  const [allowP, pstring]: [CrypteaSub | undefined, string[]] = getSupport(
    this,
    "update",
    id
  );

  if (allowP !== undefined) {
    const extra = pstring[1] !== undefined ? "/" + pstring[1] : "";

    try {
      const res = await patch_request(`${allowP.endpoint}${extra}`, obj);

      const { data } = res || { data: { error: undefined } };

      if (!data.error || data.error == undefined) {
        return {
          error: false,
          message: "Item Updated Successfully",
        };
      } else {
        return {
          error: true,
          message: data.message,
        };
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        throw err.response.data;
      }
    }
  }

  return {
    error: true,
    message: "something went wrong",
  };
};

String.prototype.save = async function (this: string, obj: Object) {
  const [allowP, pstring]: [CrypteaSub | undefined, string[]] = getSupport(
    this,
    "save"
  );

  if (allowP !== undefined) {
    const extra = pstring[1] !== undefined ? "/" + pstring[1] : "";

    try {
      const res = await post_request(`${allowP.endpoint}${extra}`, obj);

      const { data } = res || { data: { error: undefined } };

      if (!data.error || data.error == undefined) {
        return {
          error: false,
          message: "Item Added Successfully",
        };
      } else {
        return {
          error: true,
          message: data.message,
        };
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        throw err.response.data;
      }
    }
  }

  return {
    error: true,
    message: "something went wrong",
  };
};

String.prototype.delete = async function (this: string, id?: number) {
  const [allowP, pstring]: [CrypteaSub | undefined, string[]] = getSupport(
    this,
    "delete",
    id
  );

  if (allowP !== undefined) {
    const extra = pstring[1] !== undefined ? "/" + pstring[1] : '/'+(id || "");

    try {
      const res = await del_request(`${allowP.endpoint}${extra}`);

      const { data } = res || { data: { error: undefined } };

      if (!data.error || data.error == undefined) {
        return {
          error: false,
          message: "Item Deleted Successfully",
        };
      } else {
        return {
          error: true,
          message: data.message,
        };
      }
    } catch (error) {
      const err = error as AxiosError;
      // console.log(err);
      if (err.response) {
        throw err.response.data;
      }
    }
  }

  return {
    error: true,
    message: "something went wrong",
  };
};
