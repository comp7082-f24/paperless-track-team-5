import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./Analytics.css";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Analytics = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [combinedSpendingData, setCombinedSpendingData] = useState({ labels: [], datasets: [] });
  const [averageSpending, setAverageSpending] = useState(500); // Default fallback value
  const [incomeRange, setIncomeRange] = useState({ min: 0, max: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const db = getFirestore();

  const defaultCategories = ["Housing", "Grocery", "Transportation", "Utilities", "Entertainment", "Travel"];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
        console.log("User object:", user);
        console.log("User object:", user.income);


      try {
        if (!user || !user.uid) {
          console.error("Invalid user object or uid.");
          return;
        }

        // Fetch categories and filter only default categories
        const categoriesCollectionRef = collection(db, "users", user.uid, "categories");
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);
        const categoriesData = categoriesSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((category) => defaultCategories.includes(category.name)); // Only include default categories
        setCategories(categoriesData);

        // Fetch receipts for the current user
        const receiptsCollectionRef = collection(db, "users", user.uid, "receipts");
        const receiptsSnapshot = await getDocs(receiptsCollectionRef);
        const receiptsData = receiptsSnapshot.docs.map((doc) => doc.data());
        setReceipts(receiptsData);

        // Calculate current user's total spending across default categories
        let currentUserTotal = 0;
        receiptsData.forEach((receipt) => {
          if (defaultCategories.includes(receipt.category)) {
            currentUserTotal += parseFloat(receipt.total || 0);
          }
        });

        // Fetch receipts for all users and calculate aggregated spending
        const allUsersSnapshot = await getDocs(collection(db, "users"));
        let otherUsersTotal = 0;
        let minIncome = user.income - 25000;
        console.log(minIncome);
        let maxIncome = user.imcome + 25000;

        for (const userDoc of allUsersSnapshot.docs) {
          const otherUserId = userDoc.id;
          const otherUserData = userDoc.data(); // Fetch user data

          // Skip the current user and filter by income range
          if (
            otherUserId === user.uid || 
            !otherUserData.income || 
            Math.abs(otherUserData.income - user.income) <= 2500
          ) {
            continue;
          }
          
          // Fetch this user's receipts
          const otherUserReceiptsRef = collection(db, "users", otherUserId, "receipts");
          const otherUserReceiptsSnapshot = await getDocs(otherUserReceiptsRef);

          otherUserReceiptsSnapshot.docs.forEach((receiptDoc) => {
            const receipt = receiptDoc.data();
            if (defaultCategories.includes(receipt.category)) {
              otherUsersTotal += parseFloat(receipt.total || 0);
            }
          });
        }
// Handle case where no other users match the c
  // Set income range
  //setIncomeRange({ min: minIncome, max: maxIncome })

        // Prepare data for the pie chart
        const combinedData = {
          labels: ["Your Spending", "Other Users' Spending"],
          datasets: [
            {
              label: "Spending Comparison",
              data: [currentUserTotal, otherUsersTotal],
              backgroundColor: ["#36A2EB", "#FF6384"],
              hoverBackgroundColor: ["#36A2EB", "#FF6384"],
            },
          ],
        };

        setCombinedSpendingData(combinedData);
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
    labels: ["You", "Others in Your Income Bracket"],
    datasets: [
      {
        label: "Income Comparison",
        data: [
          receipts.reduce((sum, receipt) => sum + parseFloat(receipt.total || 0), 0), // Your spending
          averageSpending, // Average spending of users in the same income bracket
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
          <div className="chart-section">
            <h3>Category Breakdown</h3>
            <Pie data={categoryBreakdownData} />
          </div>

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

          <div className="chart-section">
            <h3>Your Spending vs. Other Users' Spending</h3>
            <Pie
              data={combinedSpendingData}
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
  This chart compares your total spending in default categories (${combinedSpendingData.datasets[0].data[0]}) with the
  aggregated spending of other users (${combinedSpendingData.datasets[0].data[1]}). The other users have incomes outside the range ± of your income and range from ${incomeRange.min} to ${incomeRange.max}.
</p>
<p>Your Income: ${user?.income || "Not Available"}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
