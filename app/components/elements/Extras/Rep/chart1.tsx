import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ScriptableContext,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Chart1 = ({
  styles={},
  color = "#f57059",
  labels,
  prefix = '',
  dataList,
  label,
  name
}: {
  styles?: object;
  color?: string;
  labels: (string | number)[],
  dataList: (string | number)[],
  label: string,
  prefix?: string
  name: string
}) => {

  const processTooltipModel = (model: any) => {
    const tooltip = document.querySelector(`.tooltip${name}`);

    if (tooltip !== null) {

      const tooltipModel = model.tooltip;

      tooltip.style.display = tooltipModel.opacity ? 'block' : 'none';
      

      tooltip.style.left = tooltipModel.caretX + "px";
      tooltip.style.top = tooltipModel.caretY - 66 - 5 + "px";
      (
        tooltip.querySelector(`.tooltip${name} .tooltip-label`) || { textContent: "" }
      ).textContent = tooltipModel.dataPoints[0].label;
      (
        tooltip.querySelector(`.tooltip${name} .tooltip-value .value`) || { textContent: "" }
      ).textContent = prefix+tooltipModel.dataPoints[0].raw;
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          stepSize: 60,
          display: false,
          beginAtZero: true,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
      tooltip: {
        enabled: false,
        intersect: false,
        external: processTooltipModel,
      },
      title: {
        display: false,
      },
    },
  };

//   const labels = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "Sept",
//     "Nov",
//     "Dec",
//     "Somethng",
//   ];


  const data = () => {
    return {
      labels,
      datasets: [
        {
          fill: true,
          label: label,
          data: dataList,
          lineTension: 0.1,
          borderWidth: 1,
          borderColor: color,
          backgroundColor: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 40, 0, 200);
            gradient.addColorStop(0, color + "85");
            gradient.addColorStop(0.7, color + "00");
            return gradient;
          },
        },
      ],
    };
  };



  return (
    <>
      <div style={styles} className="w-[400px] relative h-[100px]">
        {" "}
        <Line options={options} data={data()} />{" "}
        <div className={`tooltip tooltip${name}`}>
          <div className="tooltip-label"></div>
          <div className="tooltip-value">
            <span className="color-circle"></span>
            <span className="value"></span>
          </div>
        </div>
      </div>
    </>
  );
};


export default Chart1;