import toast from "react-hot-toast";

// ✅ Basic
export const notify = (message) => {
  toast(message);
};

// ✅ Success
export const toastSuccess = (message) => {
  toast.success(message);
};

// ❌ Error
export const toastError = (message) => {
  toast.error(message);
};

// ⏳ Loading
export const toastLoading = (message) => {
  return toast.loading(message);
};

// 🔄 Update existing toast (for async flows)
export const toastUpdate = (id, type, message) => {
  toast[type](message, { id });
};