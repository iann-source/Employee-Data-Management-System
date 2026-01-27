import { useState } from 'react';
import { mockPerformanceReviews, mockKPIs } from '@/app/data/mockPerformance';
import { mockEmployees } from '@/app/data/mockEmployees';
import { TrendingUp, Target, Award, ChevronDown, ChevronUp } from 'lucide-react';

export function PerformancePage() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const filteredReviews = selectedEmployee
    ? mockPerformanceReviews.filter((r) => r.employeeId === selectedEmployee)
    : mockPerformanceReviews;

  const filteredKPIs = selectedEmployee
    ? mockKPIs.filter((k) => k.employeeId === selectedEmployee)
    : mockKPIs;

  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case 'Exceeded':
        return 'bg-green-100 text-green-800';
      case 'Met':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Not Met':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateAverageRating = () => {
    if (filteredReviews.length === 0) return 0;
    const sum = filteredReviews.reduce((acc, review) => acc + review.overallRating, 0);
    return (sum / filteredReviews.length).toFixed(2);
  };

  const calculateKPIAchievement = () => {
    if (filteredKPIs.length === 0) return 0;
    const achieved = filteredKPIs.filter(
      (kpi) => kpi.status === 'Exceeded' || kpi.status === 'Met'
    ).length;
    return Math.round((achieved / filteredKPIs.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-indigo-600" />
          Performance Management
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Monitor employee performance, reviews, and KPIs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Average Rating</p>
          <p className={`text-2xl font-semibold mt-1 ${getRatingColor(Number(calculateAverageRating()))}`}>
            {calculateAverageRating()} / 5.0
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">KPI Achievement Rate</p>
          <p className="text-2xl font-semibold text-indigo-600 mt-1">
            {calculateKPIAchievement()}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Reviews</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {filteredReviews.length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Employee
        </label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Employees</option>
          {mockEmployees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* KPIs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-600" />
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredKPIs.map((kpi) => {
            const employee = mockEmployees.find((e) => e.id === kpi.employeeId);
            const progress = (kpi.actual / kpi.target) * 100;

            return (
              <div key={kpi.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{kpi.kpiName}</h3>
                    <p className="text-sm text-gray-500">
                      {employee?.firstName} {employee?.lastName} - {kpi.period}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getKPIStatusColor(
                      kpi.status
                    )}`}
                  >
                    {kpi.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{kpi.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium">
                      {kpi.target}
                      {kpi.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Actual:</span>
                    <span className={`font-medium ${progress >= 100 ? 'text-green-600' : 'text-gray-900'}`}>
                      {kpi.actual}
                      {kpi.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        progress >= 100 ? 'bg-green-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    {Math.round(progress)}% of target
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Reviews Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-600" />
          Performance Reviews
        </h2>
        <div className="space-y-4">
          {filteredReviews.map((review) => {
            const employee = mockEmployees.find((e) => e.id === review.employeeId);
            const isExpanded = expandedReview === review.id;

            return (
              <div key={review.id} className="bg-white rounded-lg shadow">
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {employee?.firstName} {employee?.lastName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {employee?.department} - {employee?.position}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Review Period: {review.reviewPeriod} | Date:{' '}
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Overall Rating</p>
                        <p className={`text-2xl font-semibold ${getRatingColor(review.overallRating)}`}>
                          {review.overallRating.toFixed(1)}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                    {/* Ratings Breakdown */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Ratings Breakdown
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(review.ratings).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-indigo-600 h-2 rounded-full"
                                  style={{ width: `${(value / 5) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-8">
                                {value.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Strengths</h4>
                        <p className="text-sm text-gray-600">{review.strengths}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Areas for Improvement
                        </h4>
                        <p className="text-sm text-gray-600">{review.areasForImprovement}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Goals</h4>
                        <p className="text-sm text-gray-600">{review.goals}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Comments</h4>
                        <p className="text-sm text-gray-600">{review.comments}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
