
const months: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const eDate = (date: number) => {
  const xx = new Date(date);

  return {
    month: xx.getMonth(),
    day: xx.getDate(),
    hour: xx.getHours(),
    min: xx.getMinutes(),
  };
};

const generateData = ({
  data,
  secondary,
  hourx,
  h24,
  mday,
  hourly,
  addAmt,
}: {
  data: any[];
  secondary: number[];
  hourx: number;
  h24: boolean;
  mday: number;
  addAmt: boolean;
  hourly: number;
}) => {
  const today = new Date().getTime();

  const time = today - 24 * 60 * 60 * 1000 * mday;

  const selAmount: number[] = [];
  const selected: number[] = [];

  data.forEach((v: number, i: number) => {
    if (v >= time) {
      selAmount.push(secondary[i]);
      selected.push(v);
    }
  });

  const edata = [];
  const label = [];

  for (let z = 0; z <= hourx; z += hourly) {
    const i = z / hourx;

    const hr = i * 60 * 60 * 24 * 1000 * mday;

    const hrp = (i + 1 / hourx) * 60 * 60 * 24 * 1000 * mday;

    const { day, hour, month } = eDate(time + hr);

    const hhour = h24
      ? String(hour).length < 2
        ? "0" + hour
        : hour
      : hour % 12 || 12;

    label.push(
      `${day} ${months[month]} ${hhour}:00${
        h24 ? "" : hour >= 12 ? "pm" : "am"
      }`
    );

    let count = 0;

    selected.forEach((v: number, ix: number) => {
      if (v >= time + hr && v <= time + hrp) {
        count += !addAmt ? selAmount[ix] / selAmount[ix] : selAmount[ix];
      }
    });

    edata.push(count);
  }

  return { data: edata, label };
};

export const totSub = (data: any[]) => {

    const today = new Date().getTime();
    let num: number = 0;
    data.forEach((v: any, i: number) => {
      if (v.remind > today) {
        num++;
      }
    });

    return num;
} 

const generateDataSub = ({
  data,
  secondary,
  hourx,
  h24,
  mday,
  hourly,
}: {
  data: any[];
  secondary: number[];
  hourx: number;
  h24: boolean;
  mday: number;
  hourly: number;
}) => {
  
  const today = new Date().getTime();

  const time = today - 24 * 60 * 60 * 1000 * mday;

  const maxDate: number[] = [];
  const selected: number[] = [];

  data.forEach((v: number, i: number) => {
    if (v >= time || secondary[i] > today) {
      maxDate.push(secondary[i]);
      selected.push(v);
    }
  });

  const edata = [];
  const label = [];
  let upd = false;
  for (let z = 0; z <= hourx; z += hourly) {
    const i = z / hourx;

    const hr = i * 60 * 60 * 24 * 1000 * mday;

    const hrp = (i + 1 / hourx) * 60 * 60 * 24 * 1000 * mday;

    const { day, hour, month } = eDate(time + hr);

    const hhour = h24
      ? String(hour).length < 2
        ? "0" + hour
        : hour
      : hour % 12 || 12;

    label.push(
      `${day} ${months[month]} ${hhour}:00${
        h24 ? "" : hour >= 12 ? "pm" : "am"
      }`
    );

    let count = 0; 

    selected.forEach((v: number, ix: number) => {
      if (
        (v >= time + hr && v <= time + hrp)
      ) {
        count += 1;

      }else if (secondary[ix] > today && v < time + hr) {
        count += 1;
      }
    });

    edata.push(count);
  }

  return { data: edata, label };
};

 const sortData = (
  xdata: any[],
  interval: "24h" | "7d" | "30d" | "1yr" | "all",
  h24: boolean = false, addAmt: boolean = true, sub: boolean = false
): {label: any[], data: any[]} => {
  const data: number[] = xdata.map((v) => v.created_at !== undefined ? new Date(v.created_at).getTime() : Number(v.date));

  let gen; let secondary: number[]; 

  if(!sub){
   secondary = xdata.map((v) => Number(v.amount));

  gen = {
    data,
    secondary,
    h24,
    addAmt
  };
  
}else {
   secondary = xdata.map((v) => Number(v.remind));

  gen = {
      data,
      secondary,
      h24,
      addAmt,
    };   
  }

  if (interval == "24h") {
    let results;
    const data = {
      ...gen,
      hourx: 24,
      mday: 1,
      hourly: 1,
    };

  if(!sub){
    results = generateData(data);
  }else{
    results = generateDataSub(data);
  }

  return results;
}

  if (interval == "1yr") {
    let results;

    const data = {
      ...gen,
      hourx: new Date().getFullYear() % 2 == 0 ? 8784 : 8760,
      mday: new Date().getFullYear() % 2 == 0 ? 366 : 365,
      hourly: 12,
    };

    if(!sub){
    results = generateData(data);
  }else {
    results = generateDataSub(data);
  }
  return results;
}

  if (interval == "all") {
    const sdata: number[] = data.sort((a, b) => b - a);

    const mainD: number = sdata[sdata.length - 1];

    const hourx: number = (new Date().getTime() - mainD) / (60 * 60 * 1000);

    const mday = hourx / 24;

    let hourly = 1;

    if (hourx >= 168) {
      hourly = 3;
    } else if (hourx >= 720) {
      hourly = 6;
    } else if (hourx >= 3085) {
      hourly = 12;
    }
    let results;

    const tdata = {
      ...gen,
      hourx,
      mday,
      hourly,
    };

  if(!sub){
    results = generateData(tdata);
  }else{
    results = generateDataSub(tdata);
  }
  return results;
}

  if (interval == "30d") {
    let results;
    const tdata = {
      ...gen,
      hourx: 720,
      mday: 30,
      hourly: 3,
    };
  if(!sub){
    results = generateData(tdata);
  }else{
    results = generateDataSub(tdata);
  }

  return results;

}

  if (interval == "7d") {
    let results;
    const data = {
      ...gen,
      hourx: 168,
      mday: 7,
      hourly: 1,
    };
    if(!sub){
    results = generateData(data);
  }else{
    results = generateDataSub(data);
  }
  return results;
}

  return {label: [], data: []};
};


export default sortData;