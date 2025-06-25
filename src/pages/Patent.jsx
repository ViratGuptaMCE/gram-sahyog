import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Patent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    patentTitle: "",
    patentDescription: "",
  });

  const [ticketNumber, setTicketNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateTicketNumber = () => {
    return "PAT-" + Date.now().toString().slice(-8);
  };
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicketNumber = generateTicketNumber();
    setTicketNumber(newTicketNumber);

    // Get existing applications from localStorage or initialize empty array
    const existingApplications =
      JSON.parse(localStorage.getItem("patentApplications")) || [];

    // Create new application object
    const newApplication = {
      ...formData,
      ticketNumber: newTicketNumber,
      status: "Submitted",
      createdAt: new Date().toISOString(),
    };

    // Add new application to array and save to localStorage
    localStorage.setItem(
      "patentApplications",
      JSON.stringify([...existingApplications, newApplication])
    );

    setIsSubmitted(true);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingNumber) return;

    // Get applications from localStorage
    const applications =
      JSON.parse(localStorage.getItem("patentApplications")) || [];

    // Find application with matching ticket number
    const foundApplication = applications.find(
      (app) => app.ticketNumber === trackingNumber
    );

    if (foundApplication) {
      setTrackingStatus(foundApplication.status);
      setIsTracking(true);
    } else {
      alert("No application found with this ticket number.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!isSubmitted ? (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Patent Application Form
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patent Title
                </label>
                <input
                  type="text"
                  name="patentTitle"
                  value={formData.patentTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patent Description
                </label>
                <textarea
                  name="patentDescription"
                  value={formData.patentDescription}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Supporting Documents (PDF or Video)
                </label>
                <input
                  type="file"
                  accept=".pdf,.mp4,.mov,.avi"
                  onChange={handleFileChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, MP4, MOV, AVI
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Application
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8 text-center scale-50">
            <div className="text-green-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Your patent application has been received and is being processed.
            </p>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="font-medium">Your Ticket Number:</p>
              <p className="text-xl font-bold text-blue-600">{ticketNumber}</p>
              <p className="mt-2">
                Current Status: <span className="font-medium">Submitted</span>
              </p>
            </div>
            <p className="mt-4 text-gray-600">
              Please save this ticket number for future reference. You can use
              it to track your application status.
            </p>
          </div>
        )}

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Track Your Application
          </h2>
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Your Ticket Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="PAT-12345678"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Check Status
            </button>
          </form>

          {isTracking && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-lg mb-2">Application Status</h3>
              <p className="mb-1">
                <span className="font-medium">Ticket Number:</span>{" "}
                {trackingNumber}
              </p>
              <p className="mb-1">
                <span className="font-medium">Status:</span> {trackingStatus}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {trackingStatus === "Submitted" &&
                  "Your application has been received and is awaiting review."}
                {trackingStatus === "Under Review" &&
                  "Your application is currently being reviewed by our team."}
                {trackingStatus === "Approved" &&
                  "Congratulations! Your patent application has been approved."}
                {trackingStatus === "Rejected" &&
                  "Your application has been rejected. Please contact support for more information."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Patent;
