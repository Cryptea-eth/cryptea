
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
  amount,
  hourx,
  h24,
  mday,
  hourly,
  addAmt,
}: {
  data: any[];
  amount: number[];
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
      selAmount.push(amount[i]);
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
        count += !addAmt ? (selAmount[ix]/selAmount[ix]) : selAmount[ix];
      }
    });

    edata.push(count);
  }
  return { data: edata, label };
};

 const sortData = (
  xdata: any[],
  interval: "24h" | "7d" | "30m" | "1yr" | "all",
  h24: boolean = false, addAmt: boolean = true
): {label: any[], data: any[]} => {
  const data: number[] = xdata.map((v) => Number(v.date));

  const amount: number[] = xdata.map((v) => Number(v.amount));

  if (interval == "24h") {
    return generateData({
      data,
      amount,
      hourx: 24,
      h24,
      mday: 1,
      hourly: 1,
      addAmt,
    });
  }

  if (interval == "1yr") {
    return generateData({
      data,
      amount,
      hourx: new Date().getFullYear() % 2 == 0 ? 8784 : 8760,
      h24,
      mday: new Date().getFullYear() % 2 == 0 ? 366 : 365,
      hourly: 12,
      addAmt,
    });
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

    return generateData({
      data,
      amount,
      hourx,
      h24,
      addAmt,
      mday,
      hourly,
    });
  }

  if (interval == "30m") {
    return generateData({
      data,
      amount,
      hourx: 720,
      h24,
      mday: 30,
      hourly: 3,
      addAmt,
    });
  }

  if (interval == "7d") {
    return generateData({
      data,
      amount,
      hourx: 168,
      h24,
      mday: 7,
      hourly: 1,
      addAmt,
    });
  }

  return {label: [], data: []};
};


export default sortData;