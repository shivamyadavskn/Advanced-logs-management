"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";

const generateTimeSeriesData = (days) => {
  return Array.from({ length: days }, (_, i) => ({
    timestamp: new Date(2023, 0, i + 1).toISOString().split("T")[0],
    errorCount: Math.floor(Math.random() * 100),
    warningCount: Math.floor(Math.random() * 200),
    infoCount: Math.floor(Math.random() * 1000),
    responseTime: Math.random() * 500,
    userCount: Math.floor(Math.random() * 10000),
  }));
};

const severityData = [
  { name: "Error", value: 1550 },
  { name: "Warning", value: 3000 },
  { name: "Info", value: 15300 },
];

const topErrorsData = [
  { name: "NullPointerException", count: 500 },
  { name: "FileNotFoundException", count: 300 },
  { name: "SQLException", count: 250 },
  { name: "IndexOutOfBoundsException", count: 200 },
  { name: "IllegalArgumentException", count: 150 },
];

const COLORS = ["#FF0000", "#FFA500", "#008000", "#0000FF", "#800080"];

const parseCSV = (csv) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csv, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

const parseJSON = (json) => {
  return new Promise((resolve) => {
    try {
      const data = JSON.parse(json);
      resolve(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      resolve([]);
    }
  });
};

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        onFileUpload(contents);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        accept=".csv,.json"
        onChange={handleFileChange}
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
      />
    </div>
  );
};

const AdvancedLogInsightsDashboard = () => {
  const [timeRange, setTimeRange] = useState("7");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeSeriesData, setTimeSeriesData] = useState(
    generateTimeSeriesData(7)
  );

  const handleFileUpload = async (fileContents) => {
    try {
      if (fileContents.startsWith("{") || fileContents.startsWith("[")) {
        const data = await parseJSON(fileContents);
        setTimeSeriesData(data);
      } else {
        const data = await parseCSV(fileContents);
        setTimeSeriesData(data);
      }
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    setTimeSeriesData(generateTimeSeriesData(parseInt(value)));
  };

  const handleSearch = () => {
    console.log(`Searching for: ${searchTerm}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Advanced Log Insights
      </h1>

      <FileUpload onFileUpload={handleFileUpload} />

      <div className="mb-6 flex items-center space-x-4">
        <Select
          onValueChange={handleTimeRangeChange}
          value={timeRange}
          className="w-52 bg-white border rounded-lg shadow-md"
        >
          <SelectTrigger className="py-2 px-4">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"  
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm border rounded-lg py-2 px-4 shadow-md"
        />
        <Button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Search
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex border-b border-gray-300">
          <TabsTrigger
            value="overview"
            className="py-2 px-4 text-gray-700 hover:bg-gray-200 transition duration-300"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="errors"
            className="py-2 px-4 text-gray-700 hover:bg-gray-200 transition duration-300"
          >
            Errors
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="py-2 px-4 text-gray-700 hover:bg-gray-200 transition duration-300"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-200 px-4 py-2">
                <CardTitle>Log Events Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="errorCount"
                      stroke="#FF0000"
                      name="Errors"
                    />
                    <Line
                      type="monotone"
                      dataKey="warningCount"
                      stroke="#FFA500"
                      name="Warnings"
                    />
                    <Line
                      type="monotone"
                      dataKey="infoCount"
                      stroke="#008000"
                      name="Info"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-lg bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-200 px-4 py-2">
                <CardTitle>Log Severity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {severityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-200 px-4 py-2">
                <CardTitle>Top 5 Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topErrorsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#FF0000" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-lg bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-200 px-4 py-2">
                <CardTitle>Error Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="errorCount"
                      stroke="#FF0000"
                      fill="#FF0000"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-200 px-4 py-2">
                <CardTitle>Average Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="responseTime"
                      stroke="#8884d8"
                      name="Response Time (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-lg bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-200 px-4 py-2">
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="userCount"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Active Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedLogInsightsDashboard;
