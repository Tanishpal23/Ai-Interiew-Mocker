"use client";
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useMemo, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';
import { Award, Briefcase, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { getUserInterviewsAction } from '@/actions/interview';

const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    try {
      const res = await getUserInterviewsAction();
      setInterviewList(res?.interviewList || []);
      setUserAnswers(res?.userAnswers || []);
    } catch (err) {
      console.error("Error fetching dashboard interviews/analytics:", err);
    }
  };

  // Calculate interview analytics
  const analytics = useMemo(() => {
    if (!userAnswers || userAnswers.length === 0) {
      const roleCounts = {};
      interviewList.forEach(item => {
        if (item.jobPosition) {
          roleCounts[item.jobPosition] = (roleCounts[item.jobPosition] || 0) + 1;
        }
      });
      const sortedRoles = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]);
      const topRole = sortedRoles.length > 0 ? sortedRoles[0][0] : "None";

      return {
        totalInterviews: interviewList.length,
        avgScore: 0,
        ratedQuestionsCount: 0,
        attemptedCount: 0,
        unattemptedCount: 0,
        totalQuestions: 0,
        attemptRate: 0,
        topRole: topRole,
        topRoleScore: null,
      };
    }

    let totalScore = 0;
    let scoreCount = 0;
    let attempted = 0;
    let unattempted = 0;

    const answersByMockId = {};

    userAnswers.forEach((ans) => {
      const isSkipped = ans.userAnswer === "answer unattempted";
      if (isSkipped) {
        unattempted++;
      } else if (ans.userAnswer?.trim()) {
        attempted++;
      }

      if (ans.rating) {
        const match = String(ans.rating).match(/([0-9]+(?:\.[0-9]+)?)/);
        if (match) {
          const score = parseFloat(match[1]);
          if (!isNaN(score)) {
            totalScore += score;
            scoreCount++;

            if (!answersByMockId[ans.mockIdRef]) {
              answersByMockId[ans.mockIdRef] = [];
            }
            answersByMockId[ans.mockIdRef].push(score);
          }
        }
      }
    });

    const avgScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0;
    const totalQ = attempted + unattempted;
    const attemptRate = totalQ > 0 ? Math.round((attempted / totalQ) * 100) : 0;

    const mockToRole = {};
    const roleScores = {};
    const roleCounts = {};

    interviewList.forEach((interview) => {
      mockToRole[interview.mockId] = interview.jobPosition;
      roleCounts[interview.jobPosition] = (roleCounts[interview.jobPosition] || 0) + 1;
    });

    Object.entries(answersByMockId).forEach(([mockId, scores]) => {
      const role = mockToRole[mockId];
      if (role) {
        if (!roleScores[role]) {
          roleScores[role] = { total: 0, count: 0 };
        }
        scores.forEach((s) => {
          roleScores[role].total += s;
          roleScores[role].count++;
        });
      }
    });

    let topRole = "None";
    let topRoleScore = null;

    const rolesWithScores = Object.entries(roleScores)
      .map(([role, data]) => ({
        role,
        avg: data.count > 0 ? data.total / data.count : 0,
      }))
      .sort((a, b) => b.avg - a.avg);

    if (rolesWithScores.length > 0 && rolesWithScores[0].avg > 0) {
      topRole = rolesWithScores[0].role;
      topRoleScore = rolesWithScores[0].avg.toFixed(1);
    } else {
      const sortedByCount = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]);
      if (sortedByCount.length > 0) {
        topRole = sortedByCount[0][0];
      }
    }

    return {
      totalInterviews: interviewList.length,
      avgScore: Number(avgScore),
      ratedQuestionsCount: scoreCount,
      attemptedCount: attempted,
      unattemptedCount: unattempted,
      totalQuestions: totalQ,
      attemptRate,
      topRole,
      topRoleScore,
    };
  }, [userAnswers, interviewList]);

  return (
    <div>
      <h2 className='font-medium text-xl'>Previous Mock Interviews</h2>

      {interviewList?.length === 0 ? (
        <p className="text-sm text-gray-500 my-4">
          No mock interviews created yet. Click "+ Add New" above to create your first interview.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
          {interviewList.map((interview, index) => (
            <InterviewItemCard
              interview={interview}
              refreshData={GetInterviewList}
              key={interview.id || index}
            />
          ))}
        </div>
      )}

      {/* Analytics Section placed strictly below interview cards */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <div className="mb-4">
          <h2 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Interview Performance & Analytics
          </h2>
          <p className="text-sm text-gray-500">
            Track your interview preparation metrics, average scores, and performance trends
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
          {/* Metric 1: Total Interviews */}
          <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl shadow-sm hover:shadow transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">Interviews</span>
              <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-gray-900">{interviewList?.length || 0}</h3>
              <p className="text-xs text-gray-500 mt-1">Total Mock Sessions Created</p>
            </div>
          </div>

          {/* Metric 2: Overall Average Rating */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl shadow-sm hover:shadow transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Average Score</span>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-gray-900">
                {analytics.avgScore > 0 ? `${analytics.avgScore}/10` : "N/A"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.ratedQuestionsCount > 0
                  ? `Evaluated across ${analytics.ratedQuestionsCount} answers`
                  : "Complete an interview to see rating"}
              </p>
            </div>
          </div>

          {/* Metric 3: Questions Attempted vs Unattempted */}
          <div className="p-5 bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-xl shadow-sm hover:shadow transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Questions Attempted</span>
              <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-gray-900">{analytics.attemptedCount}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.totalQuestions > 0
                  ? `${analytics.attemptRate}% completion rate (${analytics.unattemptedCount} unattempted)`
                  : "No recorded questions yet"}
              </p>
            </div>
          </div>

          {/* Metric 4: Top Targeted / Practiced Role */}
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl shadow-sm hover:shadow transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Top Role</span>
              <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 truncate" title={analytics.topRole}>
                {analytics.topRole}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.topRoleScore
                  ? `Avg. Score: ${analytics.topRoleScore}/10`
                  : "Targeted interview position"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewList