import { Line } from "react-chartjs-2";
import toolstype from '../../../../../styles/tooltip.module.css';
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

const LineChart = ({
  styles = {},
  color = ["#f57059", "#c5442e"],
  labels,
  prefix = "",
  dataList,
  label,
  name,
}: {
  styles?: object;
  color?: string[];
  labels: (string | number)[];
  dataList: (string | number)[][];
  label: string[];
  prefix?: string;
  name: string;
}) => {
  const processTooltipModel = (model: any) => {
    const tooltip = document.querySelector(`.tooltip${name}`) as HTMLDivElement;

    if (tooltip !== null) {
      const tooltipModel = model.tooltip;

      tooltip.style.display = tooltipModel.opacity ? "block" : "none";

      tooltip.style.left = tooltipModel.caretX + "px";
      tooltip.style.top = tooltipModel.caretY - 66 - 5 + "px";

      if(label.length > 1)
        (tooltip.querySelector(`.tooltip${name} .tooltip_label`) || {textContent: ''}).textContent = tooltipModel.dataPoints[0].dataset.label;
      
      
      (
        tooltip.querySelector(`.tooltip${name} .tooltip_sublabel`) || {
          textContent: "",
        }
      ).textContent = "time: " + tooltipModel.dataPoints[0].label;
      (
        tooltip.querySelector(`.tooltip${name} .tooltip_value .value`) || {
          textContent: "",
        }
      ).textContent = prefix + tooltipModel.dataPoints[0].raw;
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
      datasets: dataList.map((v: (string | number)[], i: number) => ({
        fill: true,
        label: label[i],
        data: v,
        lineTension: 0.1,
        borderWidth: 1,
        borderColor: color[i],
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 40, 0, 200);
          gradient.addColorStop(0, color[i] + "85");
          gradient.addColorStop(0.7, color[i] + "00");
          return gradient;
        },
      })),
    };
  };

  return (
    <>
      <div style={styles} className="w-[400px] relative h-[100px]">
        {" "}
        <Line options={options} data={data()} />{" "}
        <div className={`${toolstype.tooltip} tooltip tooltip${name}`}>
          <div
            style={{
              fontWeight: label.length > 1 ? 700 : undefined,
            }}
            className={`${toolstype.tooltip_label} tooltip_label`}
          ></div>
          <div
            style={{
              fontWeight: label.length < 2 ? 700 : undefined,
              padding: label.length < 2 ? "6px 2px" : undefined,
            }}
            className={`${toolstype.tooltip_sublabel} tooltip_sublabel`}
          ></div>
          <div className={`${toolstype.tooltip_value} tooltip_value`}>
            <span className={`${toolstype.color_circle} color_circle`}></span>
            <span className={`${toolstype.value} value`}></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LineChart;
