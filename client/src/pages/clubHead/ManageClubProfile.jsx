import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Save, ArrowLeft, CheckCircle2, AlertCircle, Plus, Trash2, Image, Camera, Upload } from 'lucide-react';

export const ManageClubProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clubId, setClubId] = useState(null);
  const [formData, setFormData] = useState({
    logo: '',
    shortDescription: '',
    detailedDescription: '',
    facultyCoordinator: '',
    contactEmail: '',
    instagram: '',
    linkedin: '',
    website: '',
    activities: '',
    achievements: '',
    eventGallery: [],
    coreMembers: [],
  });

  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        const res = await api.get('/clubs');
        if (res.data.success) {
          const myClub = res.data.data.find(
            (c) => c.clubHead?._id === user._id || c.clubHead === user._id
          );
          if (myClub) {
            setClubId(myClub._id);
            setFormData({
              logo: myClub.logo || '',
              shortDescription: myClub.shortDescription || '',
              detailedDescription: myClub.detailedDescription || '',
              facultyCoordinator: myClub.facultyCoordinator || '',
              contactEmail: myClub.contactEmail || '',
              instagram: myClub.instagram || '',
              linkedin: myClub.linkedin || '',
              website: myClub.website || '',
              activities: Array.isArray(myClub.activities) ? myClub.activities.join(', ') : '',
              achievements: Array.isArray(myClub.achievements) ? myClub.achievements.join(', ') : '',
              eventGallery: myClub.eventGallery || [],
              coreMembers: myClub.coreMembers || [],
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      setMsg({ type: '', text: '' });

      const data = new FormData();
      data.append('image', file);

      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setFormData((prev) => ({ ...prev, logo: res.data.data.url }));
        setMsg({ type: 'success', text: 'Club logo uploaded to Cloudinary successfully!' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Logo upload failed.' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleGalleryFilesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingGallery(true);
      setMsg({ type: '', text: '' });

      const data = new FormData();
      files.forEach((file) => data.append('images', file));

      const res = await api.post('/upload/multiple', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setFormData((prev) => ({
          ...prev,
          eventGallery: [...prev.eventGallery, ...res.data.data.urls],
        }));
        setMsg({ type: 'success', text: `${res.data.data.count} event photo(s) uploaded to Cloudinary!` });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gallery upload failed.' });
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleAddGalleryPhoto = () => {
    if (newPhotoUrl.trim()) {
      setFormData({
        ...formData,
        eventGallery: [...formData.eventGallery, newPhotoUrl.trim()],
      });
      setNewPhotoUrl('');
    }
  };

  const handleRemoveGalleryPhoto = (idx) => {
    setFormData({
      ...formData,
      eventGallery: formData.eventGallery.filter((_, i) => i !== idx),
    });
  };

  const handleAddCoreMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      setFormData({
        ...formData,
        coreMembers: [...formData.coreMembers, { name: newMemberName.trim(), role: newMemberRole.trim() }],
      });
      setNewMemberName('');
      setNewMemberRole('');
    }
  };

  const handleRemoveCoreMember = (idx) => {
    setFormData({
      ...formData,
      coreMembers: formData.coreMembers.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    try {
      setSubmitting(true);
      const res = await api.put(`/clubs/${clubId}`, {
        logo: formData.logo,
        shortDescription: formData.shortDescription,
        detailedDescription: formData.detailedDescription,
        facultyCoordinator: formData.facultyCoordinator,
        contactEmail: formData.contactEmail,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        website: formData.website,
        activities: formData.activities ? formData.activities.split(',').map((s) => s.trim()) : [],
        achievements: formData.achievements ? formData.achievements.split(',').map((s) => s.trim()) : [],
        eventGallery: formData.eventGallery,
        coreMembers: formData.coreMembers,
      });

      if (res.data.success) {
        setMsg({ type: 'success', text: 'Club profile & event gallery updated successfully! Redirecting...' });
        setTimeout(() => {
          navigate('/club-dashboard');
        }, 1500);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <Link to="/club-dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-brand-700">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="font-heading text-xl font-bold text-slate-900">Manage Club Profile, Logo & Event Photos</h1>
          <p className="text-xs text-slate-500">Upload club logo to Cloudinary, add past event photos to gallery, edit about details, and manage core team</p>
        </div>

        {msg.text && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Club Profile Picture / Logo Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <label className="block font-bold text-slate-800 text-sm flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-700" /> Club Profile Picture / Logo
            </label>
            
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white border border-slate-300 flex items-center justify-center overflow-hidden shadow-sm shrink-0 relative">
                {formData.logo ? (
                  <img src={formData.logo} alt="Club Logo Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-300" />
                )}
                {uploadingLogo && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs cursor-pointer inline-flex items-center gap-2 shadow-xs transition-all">
                  <Upload className="w-4 h-4" />
                  {uploadingLogo ? 'Uploading to Cloudinary...' : 'Upload Image File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400">Upload a logo or avatar for your club</p>
              </div>
            </div>
          </div>

          {/* Event Photo Gallery Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
              <div>
                <label className="block font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Image className="w-4 h-4 text-purple-600" /> Previous Event Photo Gallery ({formData.eventGallery.length})
                </label>
                <p className="text-[11px] text-slate-500">Upload photos from past club events to feature on your public page</p>
              </div>

              <label className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs cursor-pointer inline-flex items-center gap-2 shadow-xs transition-all shrink-0 self-start sm:self-auto">
                <Upload className="w-4 h-4" />
                {uploadingGallery ? 'Uploading...' : 'Upload Photo(s)'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryFilesUpload}
                  disabled={uploadingGallery}
                  className="hidden"
                />
              </label>
            </div>

            {/* Gallery Grid Preview */}
            {formData.eventGallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.eventGallery.map((photo, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video shadow-2xs">
                    <img src={photo} alt={`Event ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryPhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-md opacity-90 hover:opacity-100 transition-opacity shadow-xs"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-3">No event photos uploaded yet. Click "Upload Photo(s)" above to add photos.</p>
            )}
          </div>


          <div>
            <label className="block font-semibold text-slate-700 mb-1">Short Description (Card Summary)</label>
            <textarea
              rows={2}
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-700"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Description (About Page)</label>
            <textarea
              rows={4}
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Faculty Coordinator</label>
              <input
                type="text"
                name="facultyCoordinator"
                value={formData.facultyCoordinator}
                onChange={handleChange}
                placeholder="Prof. S. R. Kulkarni"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="club@kitkop.edu.in"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">LinkedIn URL</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Key Activities (Comma Separated)</label>
            <input
              type="text"
              name="activities"
              value={formData.activities}
              onChange={handleChange}
              placeholder="Robo Wars, IoT Workshop, 3D Printing"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Achievements (Comma Separated)</label>
            <input
              type="text"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              placeholder="1st Prize Robocon 2025, Best Innovation Award"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          {/* Core Members Section */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <label className="block font-bold text-slate-800 text-sm">Core Members List (Informational Display)</label>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Member Name (e.g. Amit Patil)"
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300"
              />
              <input
                type="text"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                placeholder="Role (e.g. Tech Lead)"
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300"
              />
              <button
                type="button"
                onClick={handleAddCoreMember}
                className="px-3 py-1.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 shrink-0"
              >
                + Add Member
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {formData.coreMembers.map((cm, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span><strong>{cm.name}</strong> — <span className="text-brand-700">{cm.role}</span></span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCoreMember(idx)}
                    className="text-rose-600 hover:text-rose-800 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Profile & Gallery Changes
          </button>

        </form>

      </div>
    </div>
  );
};
