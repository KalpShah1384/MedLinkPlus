import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaHeart, FaPills, FaCalendar, FaFileMedical } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HealthAnalytics = () => {
  const [healthData, setHealthData] = useState({
    bloodPressure: [],
    heartRate: [],
    bloodSugar: [],
    medication: [],
    appointments: [],
    loading: true,
    error: null,
  });
  const { userData, token, backendUrl } = useContext(AppContext);

  // Dummy data for vital signs
  const generateDummyVitalSigns = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29); // 30 days ago
    const data = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        systolic: Math.floor(Math.random() * (140 - 120 + 1) + 120),
        diastolic: Math.floor(Math.random() * (90 - 80 + 1) + 80),
        rate: Math.floor(Math.random() * (80 - 60 + 1) + 60),
        level: Math.floor(Math.random() * (120 - 80 + 1) + 80)
      });
    }

    return data;
  };

  // Dummy data for medication
  const generateDummyMedication = () => {
    return [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        takenCount: 14,
        totalCount: 30,
        notes: "Take with food"
      },
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        takenCount: 7,
        totalCount: 15,
        notes: "Take in morning"
      },
      {
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        takenCount: 10,
        totalCount: 30,
        notes: "Take before bedtime"
      }
    ];
  };

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        // Use dummy data for vital signs
        const dummyVitalSigns = generateDummyVitalSigns();
        
        // Use dummy data for medication
        const dummyMedication = generateDummyMedication();

        // Fetch actual appointments data
        const appointmentsResponse = await axios.get(`${backendUrl}/api/health/appointments/${userData._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setHealthData({
          bloodPressure: dummyVitalSigns.map(sign => ({
            date: sign.date,
            systolic: sign.systolic,
            diastolic: sign.diastolic
          })),
          heartRate: dummyVitalSigns.map(sign => ({
            date: sign.date,
            rate: sign.rate
          })),
          bloodSugar: dummyVitalSigns.map(sign => ({
            date: sign.date,
            level: sign.level
          })),
          medication: dummyMedication,
          appointments: appointmentsResponse.data || [],
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching health data:', error);
        setHealthData({
          bloodPressure: [],
          heartRate: [],
          bloodSugar: [],
          medication: [],
          appointments: [],
          loading: false,
          error: 'Error fetching health data'
        });
      }
    };

    if (userData && token) fetchHealthData();
  }, [userData, token, backendUrl]);

  if (healthData.loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (healthData.error) return (
    <div className="text-red-500 text-center p-4">{healthData.error}</div>
  );

  const bloodPressureOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  const heartRateOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      {healthData.loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#54bd95]">Loading...</div>
        </div>
      ) : healthData.error ? (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {healthData.error}</span>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8 text-[#54bd95]">Health Analytics Dashboard</h1>

          {/* Vital Signs Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaHeart className="mr-3 text-red-500" />
                Blood Pressure
              </h2>
              <Line
                data={{
                  labels: healthData.bloodPressure.map(item => item.date),
                  datasets: [
                    {
                      label: 'Systolic',
                      data: healthData.bloodPressure.map(item => item.systolic),
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1,
                    },
                    {
                      label: 'Diastolic',
                      data: healthData.bloodPressure.map(item => item.diastolic),
                      borderColor: 'rgb(54, 162, 235)',
                      tension: 0.1,
                    },
                  ],
                }}
                options={bloodPressureOptions}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaHeart className="mr-3 text-red-500" />
                Heart Rate
              </h2>
              <Line
                data={{
                  labels: healthData.heartRate.map(item => item.date),
                  datasets: [
                    {
                      label: 'Heart Rate (BPM)',
                      data: healthData.heartRate.map(item => item.rate),
                      borderColor: 'rgb(255, 99, 132)',
                      tension: 0.1,
                    },
                  ],
                }}
                options={heartRateOptions}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaFileMedical className="mr-3 text-yellow-500" />
                Blood Sugar
              </h2>
              <Line
                data={{
                  labels: healthData.bloodSugar.map(item => item.date),
                  datasets: [
                    {
                      label: 'Blood Sugar (mg/dL)',
                      data: healthData.bloodSugar.map(item => item.level),
                      borderColor: 'rgb(153, 102, 255)',
                      tension: 0.1,
                    },
                  ],
                }}
                options={heartRateOptions}
              />
            </div>
          </div>

          {/* Medication Adherence */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaPills className="mr-3 text-blue-500" />
              Medication Adherence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {healthData.medication.map((med, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">{med.name}</h3>
                  <div className="mt-2">
                    <div className="text-sm text-gray-600">
                      Taken: {med.taken}/{med.total} doses
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(med.taken / med.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCalendar className="mr-3 text-green-500" />
              Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {healthData.appointments.map((appointment, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{appointment.type}</h3>
                    <p className="text-sm text-gray-600">{new Date(appointment.date).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'Upcoming'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HealthAnalytics;
