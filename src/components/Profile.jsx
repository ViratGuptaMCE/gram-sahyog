import React from "react";

const Profile = (props) => {
  return (
    <div
      className="fixed top-[400px] inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8"
      onClick={props.onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[60vw] max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between w-full items-center absolute top-0 z-0">
          <h2 className="text-xl font-bold truncate">{props.Name}</h2>
          <button
            onClick={props.onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          
          <div className="bg-blue-500 space-y-4">
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-700">Location</h3>
                <p className="text-gray-600 break-words">{props.Location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-700">Experience</h3>
                <p className="text-gray-600 break-words">{props.Experience}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-700">Specialization</h3>
                <p className="text-gray-600 break-words">
                  {props.Specialization}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-700">City</h3>
                <p className="text-gray-600 break-words">{props.City}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-red-600 space-y-4">
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-700">Rating</h3>
                <p className="text-gray-600">{props.Rating}/5</p>
              </div>
            </div>

            {props.Image_Url && (
              <div className="mt-0 flex justify-center">
                <img
                  src={props.Image_Url}
                  alt={props.Name}
                  className="max-w-[1000px] max-h-[1000px] w-[800px] h-[200px] rounded-lg shadow-sm object-contain"
                />
              </div>
            )}
          </div>

          {/* Description (full width) */}
          <div className="bg-yellow-500 col-span-2 ">
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {props.Description || "No description available"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end space-x-3 sticky bottom-0 bg-white">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            onClick={props.onClose}
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
