import { useEffect, useState } from "react";
import Header from "../components/header/Header";
import StatisticCard from "../components/statistics/StatisticCard";
import { Spin } from "antd";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";

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

  const pieData = data.map((item) => {
    return {
      id: item._id,
      value: item.totalAmount,
      label: item.customerName,
    };
  });

  const lineData = data.map((item, index) => {
    return {
      index,
      value: item.totalAmount,
      label: item.customerName,
    };
  });

  let index = [];
  let values = [];
  let labels = [];
  for (let i = 0; i < lineData.length; i++) {
    index.push(lineData[i].index + 1);
    values.push(lineData[i].value);
    labels.push(lineData[i].label);
  }

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
                <LineChart
                  xAxis={[{ data: labels, scaleType: "point" }]}
                  series={[{ data: values, showMark: false, area: true }]}
                  height={250}
                  width={600}
                  margin={{ left: 60, top: 10 }}
                />
              </div>
              <div className="md:w-1/2 md:h-64 h-60">
                <PieChart
                  series={[
                    {
                      data: pieData,
                    },
                  ]}
                  width={600}
                />
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
