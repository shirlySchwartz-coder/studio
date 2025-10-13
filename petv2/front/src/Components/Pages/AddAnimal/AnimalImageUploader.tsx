import React from 'react';
import { buttonClass, errorClass } from '../../utils/style';

interface Props {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  handleUpload: () => void;
  imagePreview: string | null;
  uploadStatus: string;
  imageUrl: string | null;
  uploadError: string | null;
  uploadProgress: number;
  API_URL?: string;
}

export const AnimalImageUploader: React.FC<Props> = ({
  handleImageChange,
  clearImage,
  handleUpload,
  imagePreview,
  uploadStatus,
  imageUrl,
  uploadError,
  uploadProgress,
  API_URL,
}) => {
  return (
    <div className="image-upload-section">
      <label>תמונה</label>
      <input
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="input-upload"
      />

      {imagePreview && (
        <div className="image-preview-box">
          <div className="relative">
            <img
              src={imagePreview}
              alt="תצוגה מקדימה"
              className="preview-img"
            />
            <button
              type="button"
              onClick={clearImage}
              className="delete-img-btn"
            >
              ✕ מחק תמונה
            </button>
          </div>

          {uploadStatus === 'loading' && (
            <div className="progress-bar-wrapper">
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">מעלה... {uploadProgress}%</p>
            </div>
          )}

          {!imageUrl && uploadStatus !== 'loading' && (
            <button
              type="button"
              onClick={handleUpload}
              className={buttonClass + ' mt-4 w-full'}
            >
              📤 אשר והעלה תמונה
            </button>
          )}

          {uploadStatus === 'succeeded' && imageUrl && (
            <div className="upload-success">
              <p className="text-green-600 font-semibold text-center">
                ✅ תמונה הועלתה בהצלחה!
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-gray-500 text-center mt-2 break-all">
                  {API_URL}
                  {imageUrl}
                </p>
              )}
            </div>
          )}

          {uploadError && (
            <p className={errorClass + ' mt-4 text-center'}>{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
};
