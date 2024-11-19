import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./Analytics.css";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Analytics = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        if (!user || !user.uid) {
          console.error("Invalid user object or uid.");
          return;
        }

        // Fetch categories
        const categoriesCollectionRef = collection(db, "users", user.uid, "categories");
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);

        // Fetch receipts
        const receiptsCollectionRef = collection(db, "users", user.uid, "receipts");
        const receiptsSnapshot = await getDocs(receiptsCollectionRef);
        const receiptsData = receiptsSnapshot.docs.map((doc) => doc.data());
        setReceipts(receiptsData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user]);

  // Prepare data for charts
  const categoryBreakdownData = {
    labels: categories.map((category) => category.name),
    datasets: [
      {
        label: "Category Breakdown",
        data: categories.map((category) =>
          receipts
            .filter((receipt) => receipt.category === category.name)
            .reduce((sum, receipt) => sum + parseFloat(receipt.total || 0), 0)
        ),
        backgroundColor: categories.map((category) => category.color || "#CCCCCC"),
        hoverBackgroundColor: categories.map((category) => category.color || "#CCCCCC"),
      },
    ],
  };

  const vendorSpendingData = {
    labels: [...new Set(receipts.map((receipt) => receipt.vendor))], // Unique vendors
    datasets: [
      {
        label: "Spending by Vendor",
        data: [...new Set(receipts.map((receipt) => receipt.vendor))].map((vendor) =>
          receipts
            .filter((receipt) => receipt.vendor === vendor)
            .reduce((sum, receipt) => sum + parseFloat(receipt.total || 0), 0)
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#FFA500"], // Add more colors as needed
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#FFA500"],
      },
    ],
  };

  const incomeComparisonData = {
    labels: ["You", "Others in Your Income Level"],
    datasets: [
      {
        label: "Income Comparison",
        data: [
          receipts.reduce((sum, receipt) => sum + parseFloat(receipt.total || 0), 0), // Your spending
          2000, // Example value for others in your income level
        ],
        backgroundColor: ["#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h2>Analytics</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : receipts.length === 0 ? (
        <p>No receipts to display. Please add some receipts.</p>
      ) : (
        <>
          {/* Category Breakdown Chart */}
          <div className="chart-section">
            <h3>Category Breakdown</h3>
            <Pie data={categoryBreakdownData} />
          </div>

          {/* Vendor Spending Chart */}
          <div className="chart-section">
            <h3>Vendor Spending</h3>
            <Bar
              data={vendorSpendingData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
            <p>This chart shows how much you spend at different vendors.</p>
          </div>

          {/* Income Comparison Chart */}
          <div className="chart-section">
            <h3>Income Comparison</h3>
            <Bar
              data={incomeComparisonData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
            <p>
              This chart compares your total spending (
              {`$${receipts.reduce((sum, receipt) => sum + parseFloat(receipt.total || 0), 0)}`}) with an average of
              others in your income level ($2000).
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
