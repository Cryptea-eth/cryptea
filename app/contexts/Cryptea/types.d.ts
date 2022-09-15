type CrypteaDBUtil = string | number | boolean | object | undefined;

export type CrypteaSub = {supports: string[], endpoint: string}

export interface CrypteaDBS {
  [index: string]: CrypteaSub;
  links: CrypteaSub;
  user: CrypteaSub;
  payments: CrypteaSub;
  views: CrypteaSub;
  templates: CrypteaSub;
}

// get links
// /link/{id}  /links

// get views
// /link/{id}/views 

// get user
// /user

// get payments
// /link/{id}/payments

// get templates
// /template

declare global {
  interface String {
    get(column: string, fresh: boolean): Promise<CrypteaDBUtil>;

    delete(id: number): Promise<boolean>

    save(item: object): Promise<boolean>

  }
}



export {};
