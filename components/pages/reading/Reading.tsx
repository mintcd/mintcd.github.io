'use client'

import React, { useState, ChangeEvent, useRef, useEffect } from 'react';

interface Log {
  status: number;
  message: string;
}

export default function Reading() {
  const [logs, setLogs] = useState<Log[]>([]); // Keep all logs in state
  const [url, setUrl] = useState<string>(''); // url is a string
  const [loading, setLoading] = useState<boolean>(false); // loading is a boolean
  const logContainerRef = useRef<HTMLDivElement | null>(null); // Ref for log container

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value);

  const fetchLogStream = () => {
    if (!url) {
      alert("Please enter a URL!");
      return;
    }

    setLogs([]); // Clear previous logs
    setLoading(true);

    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/clone?url=${url}`);

    eventSource.onmessage = (event) => {
      const log: Log = JSON.parse(event.data);
      setLogs((prevLogs) => [...prevLogs, log]); // Keep all logs in the array
      if (log.message === "Completed") {
        eventSource.close();
        window.location.href = `${process.env.NEXT_PUBLIC_SERVER}/annotation?url=${url}`;
      }
    };

    eventSource.onerror = (event) => {
      setLoading(false);
      console.error("Error in event stream:", event);
      eventSource.close();
    };

    eventSource.onopen = () => {
      setLoading(false);
    };
  };

  // Scroll to the bottom of the log container whenever logs change
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]); // Run this effect whenever logs change

  return (
    <div className="flex flex-col items-center min-h-screen py-4 bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Webpage Annotation</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={handleUrlChange}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={fetchLogStream}
            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Start Process'}
          </button>
        </div>

        <div
          ref={logContainerRef}
          className="log-container space-y-2 overflow-y-auto max-h-80" // Added overflow and fixed height
        >
          {logs.map((log, index) => (
            <div
              key={index}
              className={`p-2 rounded-md ${log.status === 200 ? ' text-green-800' : ' text-red-800'}`}
            >
              {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
