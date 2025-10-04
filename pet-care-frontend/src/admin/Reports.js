import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import axios from "axios";
import "./Admin.css";

const API_URL = "http://localhost:8080/api/pets";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function Reports() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const res = await axios.get(API_URL);
      setPets(res.data);
    };
    fetchPets();
  }, []);

  const typeData = [
    { name: "Dog", value: pets.filter(p => p.type === "Dog").length },
    { name: "Cat", value: pets.filter(p => p.type === "Cat").length },
    { name: "Bird", value: pets.filter(p => p.type === "Bird").length },
  ];

  const ageData = [
    { group: "0-2", count: pets.filter(p => p.age <= 2).length },
    { group: "3-5", count: pets.filter(p => p.age >= 3 && p.age <= 5).length },
    { group: "6-10", count: pets.filter(p => p.age >= 6 && p.age <= 10).length },
    { group: "11+", count: pets.filter(p => p.age > 10).length },
  ];

  return (
    <div className="admin-content">
      <h1>Reports & Analytics</h1>

      <h2>Pets by Type</h2>
      <PieChart width={400} height={300}>
        <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {typeData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
      </PieChart>

      <h2>Pets by Age Group</h2>
      <BarChart width={500} height={300} data={ageData}>
        <XAxis dataKey="group" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}

export default Reports;
