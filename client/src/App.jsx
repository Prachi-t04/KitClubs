import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { RoleRoute } from './components/common/RoleRoute';

// Public & Auth Pages
import { ClubDiscovery } from './pages/student/ClubDiscovery';
import { ClubDetailsPage } from './pages/student/ClubDetailsPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { LoginPage } from './pages/auth/LoginPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ProfilePage } from './pages/student/ProfilePage';
import { ApplicationFormPage } from './pages/student/ApplicationFormPage';
import { MyApplicationsPage } from './pages/student/MyApplicationsPage';
import { MyRegisteredEventsPage } from './pages/student/MyRegisteredEventsPage';
import { NotificationsPage } from './pages/student/NotificationsPage';

// Club Head Pages
import { ClubHeadDashboard } from './pages/clubHead/ClubHeadDashboard';
import { ManageClubProfile } from './pages/clubHead/ManageClubProfile';
import { ManageRecruitmentPage } from './pages/clubHead/ManageRecruitmentPage';
import { ReviewApplicationsPage } from './pages/clubHead/ReviewApplicationsPage';
import { ManageMembersPage } from './pages/clubHead/ManageMembersPage';
import { CreateEventPage } from './pages/clubHead/CreateEventPage';
import { EditEventPage } from './pages/clubHead/EditEventPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AddClubPage } from './pages/admin/AddClubPage';
import { AssignClubHeadPage } from './pages/admin/AssignClubHeadPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                {/* Public Discovery Routes */}
                <Route path="/" element={<ClubDiscovery />} />
                <Route path="/clubs" element={<ClubDiscovery />} />
                <Route path="/clubs/:id" element={<ClubDetailsPage />} />

                {/* Auth Routes */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                {/* Protected Student Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/clubs/:id/apply" element={<ProtectedRoute><ApplicationFormPage /></ProtectedRoute>} />
                <Route path="/my-applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
                <Route path="/my-events" element={<ProtectedRoute><MyRegisteredEventsPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

                {/* Protected Club Head Routes */}
                <Route path="/club-dashboard" element={<RoleRoute roles={['clubHead', 'admin']}><ClubHeadDashboard /></RoleRoute>} />
                <Route path="/club-dashboard/profile" element={<RoleRoute roles={['clubHead', 'admin']}><ManageClubProfile /></RoleRoute>} />
                <Route path="/club-dashboard/recruitment" element={<RoleRoute roles={['clubHead', 'admin']}><ManageRecruitmentPage /></RoleRoute>} />
                <Route path="/club-dashboard/applications" element={<RoleRoute roles={['clubHead', 'admin']}><ReviewApplicationsPage /></RoleRoute>} />
                <Route path="/club-dashboard/members" element={<RoleRoute roles={['clubHead', 'admin']}><ManageMembersPage /></RoleRoute>} />
                <Route path="/club-dashboard/events/new" element={<RoleRoute roles={['clubHead', 'admin']}><CreateEventPage /></RoleRoute>} />
                <Route path="/club-dashboard/events/:id/edit" element={<RoleRoute roles={['clubHead', 'admin']}><EditEventPage /></RoleRoute>} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
                <Route path="/admin/clubs/new" element={<RoleRoute roles={['admin']}><AddClubPage /></RoleRoute>} />
                <Route path="/admin/clubs/:id/assign-head" element={<RoleRoute roles={['admin']}><AssignClubHeadPage /></RoleRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
