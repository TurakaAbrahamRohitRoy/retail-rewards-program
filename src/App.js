import "./App.css";
import { useState, useEffect } from "react";

const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const App = () => {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    fetch("./customerTransactionData.json")
      .then((response) => response.json())
      .then((jsonData) => setCustomerData(jsonData));
  }, []);

  const calculateRewardPoints = (amount) => {
    let points = 0;
    if (amount > 100) {
      points += (amount - 100) * 2;
      amount = 100;
    }
    if (amount >= 50) {
      points += amount - 50;
    }
    return points;
  };

  const calculateTotalRewardPoints = (transactionRecords) => {
    let totalPoints = 0;
    transactionRecords.forEach((transaction) => {
      const points = calculateRewardPoints(transaction.amount);
      totalPoints += points;
    });
    return totalPoints;
  };

  const calculateMonthlyRewardPoints = (transactionRecords) => {
    const monthlyPoints = {};
    transactionRecords.forEach((transaction) => {
      const month = monthList[new Date(transaction.date).getMonth()];
      if (!monthlyPoints[month]) {
        monthlyPoints[month] = 0;
      }
      const points = calculateRewardPoints(transaction.amount);
      monthlyPoints[month] += points;
    });
    return monthlyPoints;
  };

  return (
    <div className="App">
      <h1>Retail Rewards Program</h1>
      <header className="App-header">
        {customerData.map((customer) => (
          <div className="customer-section">
            <p className="customer-name">
              <span>Customer Name: </span>
              {customer.customerName}
            </p>
            <p className="rewards-header">Monthly Reward Points</p>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Reward Points</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  calculateMonthlyRewardPoints(customer.transactions)
                ).map(([key, val], index) => (
                  <tr>
                    <td>{key}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              <span className="total-rewards">Total Reward Points:</span>{" "}
              {calculateTotalRewardPoints(customer.transactions)}
            </p>
          </div>
        ))}
      </header>
    </div>
  );
};

export default App;
