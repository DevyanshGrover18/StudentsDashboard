import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../Backend/firebase";
import { useNavigate } from "react-router-dom";

function Home({ user }) {
  const [toggle, setToggle] = useState("students");
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const courses = [
    "Astrobiology",
    "Renaissance Art",
    "Cryptography",
    "Behavioral Economics",
    "Marine Ecology",
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/students")
      .then((response) => {
        setStudents(response.data);
        setAllStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  const handleCourseToggle = (course) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const handleApplyFilters = () => {
    const filteredStudents = allStudents.filter((student) =>
      selectedCourses.length === 0
        ? true
        : selectedCourses.includes(student.course)
    );

    setStudents(filteredStudents);
    setShowPopup(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const gender = form.gender.value;
    const course = form.course.value;

    if (firstName.length < 3 || lastName.length < 3) {
      alert("First and Last Name must be at least 3 characters long.");
      e.preventDefault();
    } else if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      alert("Please enter a valid email address.");
      e.preventDefault();
    } else if (!gender) {
      alert("Please select a gender.");
      e.preventDefault();
    } else if (!course) {
      alert("Please select a course.");
      e.preventDefault();
    } else {
      handleSendFormData(e);
    }
  };

  const handleSendFormData = (e) => {
    e.preventDefault();
    console.log("handleSendFormData triggered");
    const form = e.target;

    axios
      .post(
        "http://localhost:8000/new-student",
        {
          first_name: form.firstName.value.trim(),
          last_name: form.lastName.value.trim(),
          email: form.email.value.trim(),
          gender: form.gender.value,
          course: form.course.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        console.log("Data Saved!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <nav className="bg-gray-400 px-4 py-3 flex items-center justify-between relative">
          <span className="text-lg sm:text-xl font-bold w-full text-center text-black">
            Welcome to Students Dashboard!
          </span>

          {/* Hamburger Icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-black focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <div className="hidden sm:flex gap-4 items-center absolute right-4">
            <button
              onClick={() => signOut(auth)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:scale-105 transition-all"
            >
              Log Out
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md z-10 flex flex-col items-start p-4 gap-2 md:hidden">
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  toggle === "students"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => {
                  setToggle("students");
                  setMenuOpen(false);
                }}
              >
                View All Students
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  toggle === "form" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => {
                  setToggle("form");
                  setMenuOpen(false);
                }}
              >
                Add a New Student
              </button>
              <button
                onClick={() => {
                  signOut(auth);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded bg-red-600 text-white"
              >
                Log Out
              </button>
            </div>
          )}
        </nav>

        <div className="hidden sm:flex flex-col sm:flex-row justify-evenly bg-gray-400">
          <div
            className={`bg-gray-200 py-2 text-center w-full sm:w-1/2 cursor-pointer ${
              toggle === "students"
                ? "border-b-2 border-blue-700 font-semibold"
                : ""
            }`}
            onClick={() => setToggle("students")}
          >
            View All Students
          </div>
          <div
            className={`bg-gray-200 py-2 text-center w-full sm:w-1/2 cursor-pointer ${
              toggle === "form"
                ? "border-b-2 border-blue-700 font-semibold"
                : ""
            }`}
            onClick={() => setToggle("form")}
          >
            Add a New Student
          </div>
        </div>

        {toggle === "students" ? (
          <div className="px-4">
            <div className="relative mt-4 mb-2 text-center text-blue-800 font-semibold text-lg sm:text-xl">
              List of Students
            </div>

            <div className="flex justify-end mb-2">
              <button
                className="bg-gray-300 border rounded px-4 py-1 flex items-center gap-2 text-sm hover:scale-105 transition"
                onClick={() => setShowPopup(!showPopup)}
              >
                <span>{!showPopup ? "Filter" : "Close"}</span>
                {/* SVG FOR FILTER */}
                {!showPopup ? (
                  <svg
                    className="h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <rect width="24" height="24" fill=""></rect>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2 5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V6.17157C22 6.96722 21.6839 7.73028 21.1213 8.29289L15.2929 14.1213C15.1054 14.3089 15 14.5632 15 14.8284V17.1716C15 17.9672 14.6839 18.7303 14.1213 19.2929L11.9193 21.4949C10.842 22.5722 9 21.8092 9 20.2857V14.8284C9 14.5632 8.89464 14.3089 8.70711 14.1213L2.87868 8.29289C2.31607 7.73028 2 6.96722 2 6.17157V5Z"
                        fill="#323232"
                      ></path>
                    </g>
                  </svg>
                ) : (
                  <svg
                    className="h-4"
                    viewBox="0 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>cross-circle</title>
                      <desc>Created with Sketch Beta.</desc>
                      <defs></defs>
                      <g
                        id="Page-1"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          id="Icon-Set"
                          transform="translate(-568.000000, -1087.000000)"
                          fill="#000000"
                        >
                          <path
                            d="M584,1117 C576.268,1117 570,1110.73 570,1103 C570,1095.27 576.268,1089 584,1089 C591.732,1089 598,1095.27 598,1103 C598,1110.73 591.732,1117 584,1117 Z M584,1087 C575.163,1087 568,1094.16 568,1103 C568,1111.84 575.163,1119 584,1119 C592.837,1119 600,1111.84 600,1103 C600,1094.16 592.837,1087 584,1087 Z M589.717,1097.28 C589.323,1096.89 588.686,1096.89 588.292,1097.28 L583.994,1101.58 L579.758,1097.34 C579.367,1096.95 578.733,1096.95 578.344,1097.34 C577.953,1097.73 577.953,1098.37 578.344,1098.76 L582.58,1102.99 L578.314,1107.26 C577.921,1107.65 577.921,1108.29 578.314,1108.69 C578.708,1109.08 579.346,1109.08 579.74,1108.69 L584.006,1104.42 L588.242,1108.66 C588.633,1109.05 589.267,1109.05 589.657,1108.66 C590.048,1108.27 590.048,1107.63 589.657,1107.24 L585.42,1103.01 L589.717,1098.71 C590.11,1098.31 590.11,1097.68 589.717,1097.28 Z"
                            id="cross-circle"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                )}
                {/* SVG ENDS */}
              </button>
            </div>

            {showPopup && (
              <div className="absolute right-4 mt-2 bg-white border border-gray-300 rounded shadow-lg p-4 w-64 z-10">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Filter by Course:
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {courses.map((course) => (
                    <label
                      key={course}
                      className="flex items-center text-sm text-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course)}
                        onChange={() => handleCourseToggle(course)}
                        className="mr-2"
                      />
                      {course}
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleApplyFilters}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Apply Filters
                </button>
              </div>
            )}

            <div className="overflow-x-auto mt-4">
              <table className="min-w-[80%] mb-10 mx-auto border border-gray-300 text-sm sm:text-base">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">First Name</th>
                    <th className="border px-4 py-2">Last Name</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Gender</th>
                    <th className="border px-4 py-2">Course</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{student.id}</td>
                      <td className="border px-4 py-2">{student.first_name}</td>
                      <td className="border px-4 py-2">{student.last_name}</td>
                      <td className="border px-4 py-2">{student.email}</td>
                      <td className="border px-4 py-2">{student.gender}</td>
                      <td className="border px-4 py-2">{student.course}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <div className="my-4 text-center text-blue-800 font-semibold text-xl">
              Please Provide the Details
            </div>
            <form action="#" onSubmit={(e) => handleFormSubmit(e)}>
              <div className="flex flex-col items-center gap-3">
                <div className="flex sm:flex-row flex-col items-center sm:justify-center gap-1 w-full">
                  <div className="flex flex-col w-3/5 sm:w-1/5">
                    <label className="text-sm">First Name</label>
                    <input
                      minLength="3"
                      maxLength="20"
                      required
                      placeholder="John"
                      type="text"
                      name="firstName"
                      className="border-2 rounded border-gray-200 outline-none px-2 py-1"
                    />
                  </div>
                  <div className="flex flex-col w-3/5 sm:w-1/5">
                    <label className="text-sm">Last Name</label>
                    <input
                      minLength="3"
                      maxLength="20"
                      required
                      placeholder="Doe"
                      type="text"
                      name="lastName"
                      className="border-2 rounded border-gray-200 outline-none px-2 py-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col w-3/5 sm:w-2/5">
                  <label className="text-sm">Email</label>
                  <input
                    required
                    placeholder="johndoe@example.com"
                    type="email"
                    name="email"
                    className="border-2 rounded border-gray-200 outline-none px-2 py-1"
                  />
                </div>

                <div className="flex sm:flex-row flex-col items-center sm:justify-center gap-1 w-full">
                  <div className="flex flex-col w-3/5 sm:w-1/5">
                    <label className="text-sm">Gender</label>
                    <select
                      name="gender"
                      required
                      className="border-2 rounded border-gray-200 outline-none px-2 py-1"
                    >
                      <option value="">--Select an option--</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Others</option>
                    </select>
                  </div>
                  <div className="flex flex-col w-3/5 sm:w-1/5">
                    <label className="text-sm">Course</label>
                    <select
                      name="course"
                      required
                      className="border-2 rounded border-gray-200 outline-none px-2 py-1"
                    >
                      <option value="">--Select an option--</option>
                      <option value="Astrobiology">Astrobiology</option>
                      <option value="Renaissance Art">Renaissance Art</option>
                      <option value="Cryptography">Cryptography</option>
                      <option value="Behavioral Economics">
                        Behavioral Economics
                      </option>
                      <option value="Marine Ecology">Marine Ecology</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 w-64 sm:w-44 text-white text-lg px-6 my-4 py-1 rounded-lg cursor-pointer hover:scale-105 transition-all duration-150 hover:shadow-md shadow-black"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
