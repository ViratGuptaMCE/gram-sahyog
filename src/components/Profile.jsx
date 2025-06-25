import React from "react";

const Profile = (props) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto px-4 py-8"
      onClick={props.onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold truncate">{props.Name}</h2>
          <button
            onClick={props.onClose}
            className="text-white hover:text-gray-300 text-3xl"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-6">
          {/* Left Column */}
          <div className="space-y-5">
            <InfoBlock
              title="Location"
              content={props.Location}
              icon="location"
            />
            <InfoBlock
              title="Experience"
              content={props.Experience}
              icon="briefcase"
            />
            <InfoBlock
              title="Specialization"
              content={props.Specialization}
              icon="star"
            />
            <InfoBlock title="City" content={props.City} icon="map" />
          </div>

          {/* Right Column */}
          <div className="space-y-5 flex flex-col items-center">
            <InfoBlock title="Rating" content={`${props.Rating}/5`} icon="rating" />

            {props.Image_Url && (
              <div className="rounded-full overflow-hidden border-4 border-white shadow-md w-40 h-40">
                <img
                  src={props.Image_Url}
                  alt={props.Name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Description Full Width */}
          <div className="md:col-span-2 bg-yellow-100 p-4 rounded-lg shadow-inner">
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {props.Description || "No description available."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end space-x-3 bg-gray-50">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            onClick={props.onClose}
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Block
const InfoBlock = ({ title, content, icon }) => {
  const icons = {
    location: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    briefcase: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    star: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034 1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.348l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461L9.049 2.927z",
    map: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z",
    rating: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  };

  return (
    <div className="flex items-start space-x-3">
      <svg
        className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d={icons[icon]} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 break-words">{content}</p>
      </div>
    </div>
  );
};

export default Profile;
