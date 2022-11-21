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
import { useContext } from "react";
import { Chartx, dash, DashContext } from "../../../../contexts/GenContext";

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
  y = false,
  dataList,
  label,
  name,
  gradient = true,
  exportLabel = true,
  noLabel = false
}: {
  styles?: object;
  color?: string[];
  labels: (string | number)[];
  dataList: (string | number)[][];
  label: string[];
  gradient?: boolean;  
  y?: boolean;
  prefix?: string;
  name: string;
  exportLabel?: boolean;
  noLabel ?: boolean;
}) => {
  const { chartData }: { chartData: Chartx } = useContext<dash>(DashContext);

  const processTooltipModel = (model: any) => {

    if (noLabel) return false;

    const tooltip = document.querySelector(`.tooltip${name}`) as HTMLDivElement;

    const tooltipModel = model.tooltip;

    if (!exportLabel) {
      const specialTip = document.querySelector(
        ".tooltiprep"
      ) as HTMLParagraphElement;

      (
        specialTip || { innerHTML: '' }
      ).innerHTML = `$${tooltipModel.dataPoints[0].raw.toFixed(2)} - ${
        tooltipModel.dataPoints[0].label
      }`;
    }

    if (tooltip !== null) {
      tooltip.style.left = tooltipModel.caretX + "px";
      tooltip.style.top = tooltipModel.caretY - 66 - 5 + "px";

      if (label.length > 1)
        (
          tooltip.querySelector(`.tooltip${name} .tooltip_label`) || {
            textContent: "",
          }
        ).textContent = tooltipModel.dataPoints[0].dataset.label;

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
          display: y,
          beginAtZero: false,
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

  const data = () => {
    
    return {
      labels,
      datasets: dataList.map((v: (string | number)[], i: number) => ({
        fill: true,
        label: label[i],
        data: v,
        lineTension: 0.5,
        borderWidth: 1,
        borderColor: color[i],
        backgroundColor: gradient ? (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 40, 0, 200);
          gradient.addColorStop(0, color[i] + "85");
          gradient.addColorStop(0.7, color[i] + "00");
          return gradient;
        } : 'transparent',
      })),
    };
  };

  return (
    <>
      <div
        style={styles}
        onMouseEnter={() => {
          const elem = (document.querySelector(`.tooltip${name}`) || {
            style: { display: "" },
          }) as HTMLDivElement;

          elem.style.display = "block";
        }}
        onMouseLeave={() => {
          const elem = (document.querySelector(`.tooltip${name}`) || {
            style: { display: "" },
          }) as HTMLDivElement;

          elem.style.display = "none";

          if (!exportLabel) {
            if (chartData.update !== undefined) {
              const { amount, date } = chartData;
              chartData.update({
                amount,
                date,
                hide: true,
              });
            }
          }
        }}
        className="w-[400px] relative h-[100px]"
      >
        {" "}
        <Line options={options} data={data()} />{" "}
        {!noLabel && <div className={`${toolstype.tooltip} tooltip tooltip${name}`}>
          {exportLabel && (
            <>
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
            </>
          )}

          <div className={`${toolstype.tooltip_value} tooltip_value`}>
            <span className={`${toolstype.color_circle} color_circle`}></span>
            <span className={`${toolstype.value} value`}></span>
          </div>
        </div>}
      </div>
    </>
  );
};

export default LineChart;
