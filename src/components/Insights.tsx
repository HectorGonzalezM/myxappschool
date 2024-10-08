// src/components/Insights.tsx

"use client";

import React, { useState } from 'react';
import { Tweet } from './TweetDisplayer';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  Title,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

import Modal from './ui/Modal'; // Ensure correct import path
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem, // Added for checkbox items
} from './ui/dropdown-menu'; // Adjust the path as necessary
import { Button } from './ui/button'; // Adjust the path as necessary
import { Filter, Calendar, Zap } from 'lucide-react'; // Added Zap icon

import AskDataModalContent from './AskDataModalContent'; // Import the new component

// Import the custom hook
import useLockBodyScroll from '@/hooks/useLockBodyScroll'; // Adjust the path if necessary

// Define the Batch interface
interface Batch {
  batchNumber: number;
  label: string;
}

interface InsightsProps {
  tweets: Tweet[];
  batches: Batch[];
  selectedBatchNumbers: number[];
}

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
  Title
);

export default function Insights({
  tweets,
  batches,
  selectedBatchNumbers,
}: InsightsProps) {
  // State to manage which graphs are displayed
  const [selectedGraphs, setSelectedGraphs] = useState<string[]>([
    'Engagement Metrics',
    'Sentiment Analysis', // "Tweets Over Time" is now excluded
  ]);

  // State to manage selected batches
  const [selectedBatches, setSelectedBatches] = useState<number[]>(selectedBatchNumbers);

  // State to manage modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  // State to manage the "Ask Data" modal
  const [isAskDataModalOpen, setIsAskDataModalOpen] = useState(false);

  // Use the custom hook to lock body scroll when the "Ask Data" modal is open
  useLockBodyScroll(isAskDataModalOpen);

  const openAskDataModal = () => setIsAskDataModalOpen(true);
  const closeAskDataModal = () => setIsAskDataModalOpen(false);

  // Function to handle checkbox changes for graph selection
  const handleGraphSelection = (graphName: string) => {
    setSelectedGraphs((prev) =>
      prev.includes(graphName)
        ? prev.filter((name) => name !== graphName)
        : [...prev, graphName]
    );
  };

  // Function to open modal with specific graph
  const openModal = (graph: React.ReactNode) => {
    setModalContent(graph);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  // Function to handle batch selection change
  const handleBatchChange = (batchNumber: number) => {
    let updatedBatches = [...selectedBatches];
    if (updatedBatches.includes(batchNumber)) {
      updatedBatches = updatedBatches.filter((num) => num !== batchNumber);
    } else {
      updatedBatches.push(batchNumber);
    }
    setSelectedBatches(updatedBatches);

    // Update the URL with selected batch numbers
    const url = new URL(window.location.href);
    if (updatedBatches.length > 0) {
      url.searchParams.set('batches', updatedBatches.join(','));
    } else {
      url.searchParams.delete('batches');
    }
    window.location.href = url.toString();
  };

  // Data preparation for graphs
  const sortedTweets = [...tweets].sort(
    (a, b) => new Date(a.DateTime).getTime() - new Date(b.DateTime).getTime()
  );
  const timeLabels = sortedTweets.map((tweet) => new Date(tweet.DateTime));

  // Engagement Metrics per Tweet - Bar Chart
  const engagementData = {
    labels: tweets.map((_, index) => `Tweet ${index + 1}`),
    datasets: [
      {
        label: 'Likes',
        data: tweets.map((tweet) => tweet.Likes),
        backgroundColor: 'rgba(220, 38, 38, 0.5)', // Tailwind red-600
      },
      {
        label: 'Retweets',
        data: tweets.map((tweet) => tweet.Retweets),
        backgroundColor: 'rgba(16, 185, 129, 0.5)', // Tailwind green-500
      },
      {
        label: 'Replies',
        data: tweets.map((tweet) => tweet.Replies),
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // Tailwind blue-500
      },
    ],
  };

  const engagementOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Engagement Metrics per Tweet',
      },
    },
  };

  // Tweets Over Time - Line Chart
  const tweetsOverTimeData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Tweets Over Time',
        data: sortedTweets.map((_, index) => index + 1),
        borderColor: 'rgba(59, 130, 246, 0.5)', // Tailwind blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const timeSeriesOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tweets Over Time',
      },
    },
  };

  // Sentiment Analysis Data - Horizontal Bar Chart
  const sentimentCounts = tweets.reduce(
    (acc, tweet) => {
      if (tweet.Sentiment === 'Positive') acc.positive += 1;
      else if (tweet.Sentiment === 'Negative') acc.negative += 1;
      else acc.neutral += 1;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Number of Tweets',
        data: [
          sentimentCounts.positive,
          sentimentCounts.neutral,
          sentimentCounts.negative,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.5)', // Tailwind green-500
          'rgba(107, 114, 128, 0.5)', // Tailwind gray-600
          'rgba(220, 38, 38, 0.5)',   // Tailwind red-600
        ],
      },
    ],
  };

  const sentimentOptions = {
    indexAxis: 'y' as const, // Display bars horizontally
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend since labels are on the axes
      },
      title: {
        display: true,
        text: 'Sentiment Analysis of Tweets',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tweets',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sentiment',
        },
      },
    },
  };

  // Function to render the graph components conditionally
  const renderGraphs = () => {
    const graphs = [];

    if (selectedGraphs.includes('Engagement Metrics')) {
      graphs.push(
        <div
          key="Engagement Metrics"
          className="graph-container cursor-pointer"
          onClick={() =>
            openModal(
              <Bar data={engagementData} options={engagementOptions} />
            )
          }
        >
          <Bar data={engagementData} options={engagementOptions} />
        </div>
      );
    }

    if (selectedGraphs.includes('Tweets Over Time')) {
      graphs.push(
        <div
          key="Tweets Over Time"
          className="graph-container cursor-pointer"
          onClick={() =>
            openModal(
              <Line data={tweetsOverTimeData} options={timeSeriesOptions} />
            )
          }
        >
          <Line data={tweetsOverTimeData} options={timeSeriesOptions} />
        </div>
      );
    }

    if (selectedGraphs.includes('Sentiment Analysis')) {
      graphs.push(
        <div
          key="Sentiment Analysis"
          className="graph-container cursor-pointer"
          onClick={() =>
            openModal(
              <Bar data={sentimentData} options={sentimentOptions} />
            )
          }
        >
          <Bar data={sentimentData} options={sentimentOptions} />
        </div>
      );
    }

    // Additional graphs can be added here following the same pattern

    return graphs;
  };

  // Calculate KPIs
  const totalTweets = tweets.length;

  const totalLikes = tweets.reduce((sum, tweet) => sum + (tweet.Likes || 0), 0);
  const averageLikes = totalLikes / totalTweets || 0;

  const totalRetweets = tweets.reduce((sum, tweet) => sum + (tweet.Retweets || 0), 0);
  const averageRetweets = totalRetweets / totalTweets || 0;

  const totalReplies = tweets.reduce((sum, tweet) => sum + (tweet.Replies || 0), 0);
  const averageReplies = totalReplies / totalTweets || 0;

  const sentimentPercentage = {
    positive: totalTweets > 0 ? ((sentimentCounts.positive / totalTweets) * 100).toFixed(1) : '0.0',
    neutral: totalTweets > 0 ? ((sentimentCounts.neutral / totalTweets) * 100).toFixed(1) : '0.0',
    negative: totalTweets > 0 ? ((sentimentCounts.negative / totalTweets) * 100).toFixed(1) : '0.0',
  };

  // Calculate total engagements
  const totalEngagements = tweets.reduce(
    (sum, tweet) =>
      sum + (tweet.Likes || 0) + (tweet.Retweets || 0) + (tweet.Replies || 0),
    0
  );

  // Function to render the KPIs
  const renderKPIs = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {/* Existing KPI cards */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-sm text-gray-500">Total Tweets</p>
        <p className="text-2xl font-bold">{totalTweets}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-sm text-gray-500">Avg Likes per Tweet</p>
        <p className="text-2xl font-bold">{averageLikes.toFixed(1)}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-sm text-gray-500">Avg Retweets per Tweet</p>
        <p className="text-2xl font-bold">{averageRetweets.toFixed(1)}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-sm text-gray-500">Avg Replies per Tweet</p>
        <p className="text-2xl font-bold">{averageReplies.toFixed(1)}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-sm text-gray-500">Positive Tweets</p>
        <p className="text-2xl font-bold">{sentimentPercentage.positive}%</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-sm text-gray-500">Neutral Tweets</p>
        <p className="text-2xl font-bold">{sentimentPercentage.neutral}%</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-sm text-gray-500">Negative Tweets</p>
        <p className="text-2xl font-bold">{sentimentPercentage.negative}%</p>
      </div>
      {/* New KPI card for Total Engagements */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-sm text-gray-500">Total Engagements</p>
        <p className="text-2xl font-bold">{totalEngagements}</p>
      </div>
    </div>
  );

  // Predefined graph options
  const graphOptions = [
    'Engagement Metrics',
    'Tweets Over Time',
    'Sentiment Analysis',
    // Add more graph names if any
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Insights</h2>

      {/* Render KPIs */}
      {renderKPIs()}

      {/* Buttons */}
      <div className="mb-4 flex flex-wrap items-center space-x-2">
        {/* Graph Selection Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Select Graphs <Filter className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {graphOptions.map((graphName) => (
              <DropdownMenuItem key={graphName} asChild>
                <label className="flex items-center px-2 py-2 w-full cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGraphs.includes(graphName)}
                    onChange={() => handleGraphSelection(graphName)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">{graphName}</span>
                </label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Ask Data Button */}
        <Button variant="outline" onClick={openAskDataModal}>
          Ask Data <Zap className="ml-2 h-4 w-4" />
        </Button>

        {/* Custom Multi-Select Batch Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Select Batches <Calendar className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 overflow-auto">
            {batches.map((batch) => (
              <DropdownMenuCheckboxItem
                key={batch.batchNumber}
                checked={selectedBatches.includes(batch.batchNumber)}
                onCheckedChange={() => handleBatchChange(batch.batchNumber)}
              >
                {batch.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Graphs */}
      <div className="space-y-8">{renderGraphs()}</div>

      {/* Modals */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>

      {/* Ask Data Modal with Body Scroll Lock */}
      <Modal isOpen={isAskDataModalOpen} onClose={closeAskDataModal}>
        <AskDataModalContent
          tweets={tweets}
          onClose={closeAskDataModal}
        />
      </Modal>
    </div>
  );
}

