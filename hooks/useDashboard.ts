import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { Project } from '../types';

interface DashboardStats {
  total_clients: number;
  total_projects: number;
  total_revenue: number;
  active_projects: number;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsData, projectsData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentProjects()
      ]);

      setStats(statsData);
      setRecentProjects(projectsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Don't auto-load dashboard data to prevent 403 errors
  // Data will be loaded on demand or when explicitly requested
  // useEffect(() => {
  //   loadDashboardData();
  // }, []);

  return {
    stats,
    recentProjects,
    loading,
    error,
    refresh: loadDashboardData
  };
};