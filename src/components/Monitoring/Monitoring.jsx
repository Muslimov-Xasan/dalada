import Nav from "../Nav/Nav";
import "./Monitoring.css";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";

import { useState, useEffect } from "react";

ChartJS.register(
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Monitoring() {
  const [selectedOption, setSelectedOption] = useState("DAILY");
  const [ChooseDate, setChooseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [monitoring, setMonitoring] = useState({
    date: "",
    key: "",
  });

  useEffect(() => {
    fetchData();
  }, [selectedOption, ChooseDate]); // Run fetchData when selectedOption changes

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    fetchData(); // Fetch new data when the select option changes
  };

  const fetchData = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");

      const response = await fetch(
        "http://188.225.10.97:8080/api/v1/products/statistics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            date: ChooseDate,
            key: selectedOption,
          }),
        }
      );

      const responseData = await response.json();
      console.log(responseData);
      setMonitoring((prevMonitoring) => ({
        ...prevMonitoring,
        date: responseData.date,
        key: responseData.key,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const chartConfig = {
    type: "line",
    width: "100%",
    height: 500,
    series: [
      {
        name: "Sales",
        data: [0, 30, 20, 50, 40, 90, 60, 80, 70, 100],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#25B679"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: [
          "10AM",
          "11AM",
          "12AM",
          "01PM",
          "02PM",
          "03PM",
          "04PM",
          "05PM",
          "06PM",
          "07PM",
        ],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <>
      <div className="container">
        <Nav />

        <div className="drmamma-wrapper">
          <div className="text-wrapper">
            <h2 className="drmamma-title">Monitoring</h2>
            <p className="drmamma-title">E’lonlar</p>
          </div>
          <select
            className="day-select"
            onChange={handleSelectChange}
            value={selectedOption}
          >
            <option className="option" value="DAILY">
              Day
            </option>
            <option className="option" value="MONTHLY">
              Month
            </option>
            <option className="option" value="YEARLY">
              Year
            </option>
          </select>
          <input
            className="date-input"
            type="date"
            onChange={(event) => setChooseDate(event.target.value)}
            value={ChooseDate}
          />
        </div>

        <Card>
          <CardBody className="w-full px-2 pb-0">
            <Chart {...chartConfig} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Monitoring;
