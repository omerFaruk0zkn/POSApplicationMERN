import { useEffect, useState } from "react";
import Header from "../components/header/Header";
import StatisticCard from "../components/statistics/StatisticCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { Spin } from "antd";

const StatisticPage = () => {
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("postUser"));

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(
          process.env.REACT_APP_SERVER_URL + "/api/products/get-all"
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch(process.env.REACT_APP_SERVER_URL + "/api/bills/get-all")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  const totalAmount = () => {
    const amount = data.reduce((total, item) => item.totalAmount + total, 0);
    return amount.toFixed(2);
  };

  const areaData = data.map((item) => {
    return {
      name: item.customerName,
      uv: item.totalAmount,
      pv: item.tax,
      amt: item.subTotal,
    };
  });

  const radialData = data.map((item) => {
    return {
      name: item.customerName,
      uv: item.totalAmount,
      pv: item.tax,
      fill: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)})`,
    };
  });

  const style = {
    top: 0,
    left: 350,
    lineHeight: "24px",
  };

  return (
    <>
      <Header />
      <h1 className="text-4xl font-bold text-center mb-4">İstatistiklerim</h1>
      {data ? (
        <div className="px-6 md:pb-0 pb-20 overflow-page max-h-[calc(100vh_-_128px)] overflow-y-auto">
          <div className="statistic-section">
            <h2 className="text-lg">
              Hoş geldin{" "}
              <span className="text-green-700 font-bold text-xl">
                {user.username}.
              </span>
            </h2>

            <div className="statistic-cards grid xl:grid-cols-4 md:grid-cols-2 my-10 md:gap-10 gap-4">
              <StatisticCard
                title={"Toplam Müşteri"}
                amount={data?.length}
                img={"images/user.png"}
              />
              <StatisticCard
                title={"Toplam Kazanç"}
                amount={totalAmount() + "₺"}
                img={"images/money.png"}
              />
              <StatisticCard
                title={"Toplam Satış"}
                amount={data?.length}
                img={"images/sale.png"}
              />
              <StatisticCard
                title={"Toplam Ürün"}
                amount={products?.length}
                img={"images/product.png"}
              />
            </div>
            <div className="flex justify-between gap-10 md:flex-row flex-col items-center">
              <div className="md:w-1/2 md:h-64 h-60">
                <AreaChart
                  width={500}
                  height={400}
                  data={areaData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </div>
              <div className="md:w-1/2 md:h-64 h-60">
                <RadialBarChart
                  width={600}
                  height={400}
                  cx={150}
                  cy={150}
                  innerRadius={20}
                  outerRadius={140}
                  barSize={10}
                  data={radialData}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: "insideStart", fill: "#000" }}
                    background
                    clockWise
                    dataKey="uv"
                  />
                  <Legend
                    iconSize={10}
                    width={120}
                    height={140}
                    layout="vertical"
                    verticalAlign="middle"
                    wrapperStyle={style}
                  />
                </RadialBarChart>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spin
          size="large"
          className="absolute top-1/2 h-screen w-screen flex justify-center"
        />
      )}
    </>
  );
};

export default StatisticPage;
