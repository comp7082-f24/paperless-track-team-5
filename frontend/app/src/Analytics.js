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
import { getFirestore, collection, doc, getDocs, getDoc, query, where } from "firebase/firestore";
import "./Analytics.css";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Analytics = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [combinedSpendingData, setCombinedSpendingData] = useState({ labels: [], datasets: [] });
  const [averageSpending, setAverageSpending] = useState(500); // Default fallback value
  const [incomeRange, setIncomeRange] = useState({ min: 0, max: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Set initial start and end date to the current month's range
  const now = new Date();
  const initialStartDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]; // First day of the month
  const initialEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]; // Last day of the month

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const db = getFirestore();

  const defaultCategories = ["Housing", "Grocery", "Transportation", "Utilities", "Entertainment", "Travel"];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      console.log("User object:", user);

      try {
        if (!user || !user.uid) {
          console.error("Invalid user object or uid.");
          return;
        }

        // Fetch user income from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("Fetched user data from Firestore:", userData);

          if (userData.income) {
            console.log("User Income:", userData.income);
            setIncomeRange({
              min: parseFloat(userData.income) - 2500,
              max: parseFloat(userData.income) + 2500,
            });
          } else {
            console.error("Income field is missing in Firestore.");
          }
        } else {
          console.error("No user document found in Firestore for UID:", user.uid);
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
        const receiptsData = receiptsSnapshot.docs.map((doc) => {
          const data = doc.data();
          // Convert `date` string to Date object for filtering
          return {
            ...data,
            date: new Date(data.date), // Convert date string to Date object
          };
        });

        // Filter receipts by date range
        const filteredReceipts = receiptsData.filter((receipt) => {
          const receiptDate = receipt.date; // Already a Date object
          const start = new Date(startDate);
          const end = new Date(endDate);

          return receiptDate >= start && receiptDate <= end;
        });

        console.log("Filtered receipts:", filteredReceipts);
        setReceipts(filteredReceipts);

        // Calculate current user's total spending across default categories
        let currentUserTotal = 0;
        filteredReceipts.forEach((receipt) => {
          if (defaultCategories.includes(receipt.category)) {
            currentUserTotal += parseFloat(receipt.total || 0);
          }
        });

        // Fetch receipts for all users and calculate aggregated spending
        const allUsersSnapshot = await getDocs(collection(db, "users"));
        let otherUsersTotal = 0;

        for (const userDoc of allUsersSnapshot.docs) {
          const otherUserId = userDoc.id;
          const otherUserData = userDoc.data(); // Fetch user data

          // Skip the current user and filter by income range
          if (!otherUserData.income || otherUserId === user.uid) {
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
  }, [user, startDate, endDate]); // Rerun when date range changes

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

  // Prepare top 5 vendors for the bar chart
  const vendorSpending = receipts.reduce((acc, receipt) => {
    acc[receipt.vendor] = (acc[receipt.vendor] || 0) + parseFloat(receipt.total || 0);
    return acc;
  }, {});

  const topVendors = Object.entries(vendorSpending)
    .sort(([, a], [, b]) => b - a) // Sort by spending descending
    .slice(0, 5); // Take top 5 vendors

  const vendorSpendingData = {
    labels: topVendors.map(([vendor]) => vendor),
    datasets: [
      {
        label: "Top 5 Vendors by Spending",
        data: topVendors.map(([, spending]) => spending),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#FFA500"], // Add more colors as needed
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#FFA500"],
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h2>Analytics</h2>
      <div className="date-filter">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
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
            <h3>Top 5 Vendors</h3>
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
            <p>This chart shows your top 5 vendors by spending.</p>
          </div>
          <div className="chart-section">
            <h3>Your Spending vs. Other Users' Spending</h3>
            <Pie data={combinedSpendingData} />
            <p>
              This chart compares your total spending in default categories (${combinedSpendingData.datasets[0].data[0]}) with the
              aggregated spending of other users (${combinedSpendingData.datasets[0].data[1]}). The other users have incomes outside the range ± of your income and range from ${incomeRange.min} to ${incomeRange.max}.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
