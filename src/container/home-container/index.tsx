"use client";

import { useEffect, useState } from "react";
import { useCatererContext } from "@/context/caterers_context";
import {
  Plus,
  X,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Users,
  ChefHat,
  Loader2,
  Search,
} from "lucide-react";
import "./style.css";

interface Caterer {
  _id: string;
  name: string;
  location: string;
  price_per_plate: number;
  cuisiness: string[];
  rating: number;
  created_at: string;
  updated_at: string;
}

interface FormData {
  name: string;
  location: string;
  price_per_plate: string;
  cuisiness: string;
  rating: string;
}

const initialFormData: FormData = {
  name: "",
  location: "",
  price_per_plate: "",
  cuisiness: "",
  rating: "",
};

export default function CaterersPage() {
  const { caterers, loading, getAllCaterers, createCaterer } =
    useCatererContext();

  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllCaterers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name as keyof FormData]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.name.trim()) errors.name = "Caterer name is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.price_per_plate || Number(formData.price_per_plate) <= 0) {
      errors.price_per_plate = "Enter a valid price";
    }
    if (!formData.cuisiness.trim())
      errors.cuisiness = "At least one cuisine is required";
    if (
      !formData.rating ||
      Number(formData.rating) < 0 ||
      Number(formData.rating) > 5
    ) {
      errors.rating = "Rating must be 0-5";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createCaterer({
        name: formData.name.trim(),
        location: formData.location.trim(),
        price_per_plate: Number(formData.price_per_plate),
        cuisiness: formData.cuisiness
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        rating: Number(formData.rating),
      });

      await getAllCaterers();
      setFormData(initialFormData);
      setShowPopup(false);
    } catch (error) {
      console.error("Failed to create caterer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return "#10B981";
    if (rating >= 4.0) return "#3B82F6";
    if (rating >= 3.0) return "#F59E0B";
    return "#EF4444";
  };

  const filteredCaterers = caterers?.filter(
    (caterer: Caterer) =>
      caterer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caterer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caterer.cuisiness.some((cuisine) =>
        cuisine.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <div className="caterers-page">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <h1>Catering Partners</h1>
            <p className="header-subtitle">
              Manage your catering services and vendor relationships
            </p>
          </div>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowPopup(true)}
          aria-label="Add new caterer"
        >
          <Plus size={20} />
          <span>Add Caterer</span>
        </button>
      </div>

      <div className="search-section">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, location, or cuisine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="stats-badge">
          <Users size={16} />
          <span>{filteredCaterers?.length || 0} Partners</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 size={32} className="spin" />
          <p>Loading catering partners...</p>
        </div>
      ) : filteredCaterers?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-content">
            <ChefHat size={48} strokeWidth={1.5} />
            <h3>No Caterers Found</h3>
            <p>
              {searchTerm
                ? "No caterers match your search criteria. Try adjusting your search terms."
                : "Get started by adding your first catering partner to the platform."}
            </p>
            {!searchTerm && (
              <button
                className="add-btn secondary"
                onClick={() => setShowPopup(true)}
              >
                <Plus size={18} />
                <span>Add First Caterer</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="card-grid">
          {filteredCaterers?.map((item: Caterer) => (
            <div key={item._id} className="caterer-card">
              <div className="card-header-section">
                <div className="avatar-wrapper">
                  <div className="avatar">{getInitials(item.name)}</div>
                  <div
                    className="rating-badge"
                    style={{ backgroundColor: getRatingColor(item.rating) }}
                  >
                    <Star size={12} fill="white" color="white" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="header-info">
                  <h2 className="caterer-name">{item.name}</h2>
                  <div className="location-wrapper">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="card-details">
                <div className="detail-item">
                  <div className="detail-icon-wrapper">
                    <DollarSign size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Per Plate</span>
                    <span className="detail-value">
                      ₹{item.price_per_plate.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon-wrapper">
                    <Clock size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Partner Since</span>
                    <span className="detail-value">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="cuisines-section">
                <div className="cuisines-header">
                  <ChefHat size={14} />
                  <span>Cuisine Specialties</span>
                </div>
                <div className="cuisines-list">
                  {item.cuisiness?.map((cuisine: string, index: number) => (
                    <span key={index} className="cuisine-tag">
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPopup && (
        <div className="modal-overlay" onClick={handleClosePopup}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>New Catering Partner</h2>
                <p className="modal-subtitle">
                  Enter the details to onboard a new vendor
                </p>
              </div>
              <button
                className="icon-btn"
                onClick={handleClosePopup}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-field">
                <label htmlFor="name">Caterer Name</label>
                <input
                  id="name"
                  name="name"
                  placeholder="Enter caterer business name"
                  value={formData.name}
                  onChange={handleChange}
                  className={formErrors.name ? "input-error" : ""}
                />
                {formErrors.name && (
                  <span className="field-error">{formErrors.name}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  placeholder="e.g., Bandra West, Mumbai"
                  value={formData.location}
                  onChange={handleChange}
                  className={formErrors.location ? "input-error" : ""}
                />
                {formErrors.location && (
                  <span className="field-error">{formErrors.location}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="price_per_plate">Price Per Plate (₹)</label>
                  <input
                    id="price_per_plate"
                    name="price_per_plate"
                    type="number"
                    min="0"
                    placeholder="450"
                    value={formData.price_per_plate}
                    onChange={handleChange}
                    className={formErrors.price_per_plate ? "input-error" : ""}
                  />
                  {formErrors.price_per_plate && (
                    <span className="field-error">
                      {formErrors.price_per_plate}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="rating">Rating (0-5)</label>
                  <input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="4.5"
                    value={formData.rating}
                    onChange={handleChange}
                    className={formErrors.rating ? "input-error" : ""}
                  />
                  {formErrors.rating && (
                    <span className="field-error">{formErrors.rating}</span>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="cuisiness">
                  cuisiness{" "}
                  <span className="field-hint">(comma-separated)</span>
                </label>
                <input
                  id="cuisiness"
                  name="cuisiness"
                  placeholder="Indian, Chinese, Continental"
                  value={formData.cuisiness}
                  onChange={handleChange}
                  className={formErrors.cuisiness ? "input-error" : ""}
                />
                {formErrors.cuisiness && (
                  <span className="field-error">{formErrors.cuisiness}</span>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={handleClosePopup}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Add Partner</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
