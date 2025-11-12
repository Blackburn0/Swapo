import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AlertCircle } from "lucide-react";
import axios from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const { token, user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Determine if user is OAuth-based (no password)
  const isOAuthUser = Boolean(user?.googleId || user?.githubId);

  const handleDelete = async () => {
    if (!checked) {
      showToast("Please confirm account deletion.", "error");
      return;
    }

    if (!isOAuthUser && !password.trim()) {
      showToast("Please enter your password to confirm.", "error");
      return;
    }

    try {
      const res = await axios.delete("/auth/delete-account/", {
        headers: { Authorization: `Bearer ${token}` },
        data: isOAuthUser ? {} : { password },
        validateStatus: (status) => status < 500, // prevents global 401 redirect
      });

      if (res.status === 401 || res.status === 403) {
        showToast("Invalid or wrong password.", "error");
        return;
      }

      if (res.status === 204 || res.status === 200) {
        showToast("Your account has been permanently deleted.", "success");
        logout();
        window.location.href = "http://localhost:5173"; // ✅ redirect home
      } else {
        showToast("Failed to delete account. Try again.", "error");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      showToast("Something went wrong. Try again later.", "error");
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-white text-center px-6 py-8">
      {/* Header */}
      <header className="flex items-center mb-8">
        <button
          onClick={() => window.history.back()}
          className="text-gray-800 text-base font-medium flex items-center"
        >
          ←
        </button>
        <h1 className="flex-1 text-lg font-semibold text-gray-900">
          Delete Account
        </h1>
      </header>

      {/* Main Content */}
      <section className="flex-1 flex flex-col items-center max-w-xl mx-auto space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-red-50 p-4 rounded-full">
            <AlertCircle className="text-red-500 w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Are you sure?</h2>
            <p className="text-gray-600 mt-2 max-w-sm">
              Deleting your account is a permanent action and cannot be undone.
              All your data, including your profile, skills, and messages, will
              be permanently removed.
            </p>
          </div>
        </div>

        {/* Password Input → only show for email/password users */}
        {!isOAuthUser && (
          <div className="w-full text-gray">
            <Input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to confirm"
              className="w-full"
            />
          </div>
        )}

        {/* Checkbox */}
        <div className="flex items-start space-x-3 text-left w-full">
          <input
            type="checkbox"
            id="confirmDelete"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 w-4 h-4 accent-red-500"
          />
          <label
            htmlFor="confirmDelete"
            className="text-sm text-gray-700 leading-snug"
          >
            I understand this action is irreversible and I want to permanently
            delete my account.
          </label>
        </div>
      </section>

      {/* Delete Button */}
      <footer className="mt-auto w-full max-w-xl mx-auto">
        <Button
          onClick={handleDelete}
          className={`py-3 text-lg font-semibold w-full ${
            checked && (isOAuthUser || password.trim())
              ? "bg-[#F87171]"
              : "bg-red-300 cursor-not-allowed"
          }`}
        >
          Delete My Account
        </Button>
      </footer>
    </main>
  );
};

export default DeleteAccount;



// import { useState } from "react";
// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import { AlertCircle } from "lucide-react";
// import axios from "@/utils/axiosInstance";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/useToast";
// import { useNavigate } from "react-router-dom";

// const DeleteAccount = () => {
//   const [password, setPassword] = useState("");
//   const [checked, setChecked] = useState(false);
//   const { token, user, logout } = useAuth();
//   const { showToast } = useToast();
//   const navigate = useNavigate();

//   const handleDelete = async () => {
//     // ✅ Allow OAuth users to skip password check
//     if (!checked) {
//       showToast("Please confirm account deletion.", "error");
//       return;
//     }

//     // ✅ Require password only if user has one
//     const isOAuthUser = user?.googleId || user?.githubId;
//     if (!isOAuthUser && !password.trim()) {
//       showToast("Please enter your password to confirm.", "error");
//       return;
//     }

//     try {
//       const res = await axios.delete("/auth/delete-account/", {
//         headers: { Authorization: `Bearer ${token}` },
//         data: isOAuthUser ? {} : { password },
//         validateStatus: (status) => status < 500, // prevents interceptor redirect
//       });

//       if (res.status === 401 || res.status === 403) {
//         showToast("Invalid or wrong password.", "error");
//         return;
//       }

//       if (res.status === 204 || res.status === 200) {
//         showToast("Your account has been permanently deleted.", "success");
//         logout();
//         window.location.href = "http://localhost:5173"; // ✅ redirect home
//       } else {
//         showToast("Failed to delete account. Try again.", "error");
//       }
//     } catch (error) {
//       console.error("Delete account error:", error);
//       showToast("Something went wrong. Try again later.", "error");
//     }
//   };

//   return (
//     <main className="flex flex-col min-h-screen bg-white text-center px-6 py-8">
//       {/* Header */}
//       <header className="flex items-center mb-8">
//         <button
//           onClick={() => window.history.back()}
//           className="text-gray-800 text-base font-medium flex items-center"
//         >
//           ←
//         </button>
//         <h1 className="flex-1 text-lg font-semibold text-gray-900">
//           Delete Account
//         </h1>
//       </header>

//       {/* Main Content */}
//       <section className="flex-1 flex flex-col items-center max-w-xl mx-auto space-y-6">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="bg-red-50 p-4 rounded-full">
//             <AlertCircle className="text-red-500 w-8 h-8" />
//           </div>

//           <div>
//             <h2 className="text-2xl font-semibold text-gray-900">Are you sure?</h2>
//             <p className="text-gray-600 mt-2 max-w-sm">
//               Deleting your account is a permanent action and cannot be undone.
//               All your data, including your profile, skills, and messages, will
//               be permanently removed.
//             </p>
//           </div>
//         </div>

//         {/* Password Input — hide for OAuth users */}
//         {!user?.googleId && !user?.githubId && (
//           <div className="w-full text-gray">
//             <Input
//               type="password"
//               name="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password to confirm"
//               className="w-full"
//             />
//           </div>
//         )}

//         {/* Checkbox */}
//         <div className="flex items-start space-x-3 text-left w-full">
//           <input
//             type="checkbox"
//             id="confirmDelete"
//             checked={checked}
//             onChange={(e) => setChecked(e.target.checked)}
//             className="mt-1 w-4 h-4 accent-red-500"
//           />
//           <label
//             htmlFor="confirmDelete"
//             className="text-sm text-gray-700 leading-snug"
//           >
//             I understand this action is irreversible and I want to permanently
//             delete my account.
//           </label>
//         </div>
//       </section>

//       {/* Delete Button */}
//       <footer className="mt-auto w-full max-w-xl mx-auto">
//         <Button
//           onClick={handleDelete}
//           className={`py-3 text-lg font-semibold w-full ${
//             checked && (user?.googleId || user?.githubId || password.trim())
//               ? "bg-[#F87171]"
//               : "bg-red-300 cursor-not-allowed"
//           }`}
//         >
//           Delete My Account
//         </Button>
//       </footer>
//     </main>
//   );
// };

// export default DeleteAccount;





// import { useState } from 'react';
// import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import { AlertCircle } from 'lucide-react';
// import axios from "@/utils/axiosInstance";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/useToast";
// import { useNavigate } from "react-router-dom";


// const DeleteAccount = () => {
//   const [password, setPassword] = useState('');
//   const [checked, setChecked] = useState(false);
//   const { token, logout } = useAuth();
//   const { showToast } = useToast();
//   const navigate = useNavigate();



//   // const handleDelete = async () => {
//   //   if (!checked || !password.trim()) {
//   //     showToast("Please confirm and enter your password.", "error");
//   //     return;
//   //   }
  
//   //   try {
//   //     await axios.delete("/auth/delete-account/", {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //       data: { password },
//   //     });
  
//   //     showToast("Your account has been permanently deleted.", "success");
  
//   //     // Logout and redirect
//   //     logout();
//   //     navigate("/");
//   //   } catch (error: any) {
//   //     const msg =
//   //       error.response?.data?.detail || "Failed to delete account. Try again.";
//   //     showToast(msg, "error");
//   //   }
//   // };

//   const handleDelete = async () => {
//     if (!checked || !password.trim()) {
//       showToast("Please confirm and enter your password.", "error");
//       return;
//     }
  
//     try {
//       // Use a manual axios request that doesn't trigger interceptor redirect
//       const res = await axios.delete("/auth/delete-account/", {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { password },
//         validateStatus: (status) => status < 500, // ✅ prevents interceptor trigger
//       });
  
//       if (res.status === 401 || res.status === 403) {
//         showToast("Invalid or wrong password.", "error");
//         return;
//       }
  
//       if (res.status === 204 || res.status === 200) {
//         showToast("Your account has been permanently deleted.", "success");
//         logout();
//         window.location.href = "http://localhost:5173"; // ✅ redirect to home
//       } else {
//         showToast("Failed to delete account. Try again.", "error");
//       }
//     } catch (error) {
//       console.error("Delete account error:", error);
//       showToast("Something went wrong. Try again later.", "error");
//     }
//   };

  
//   return (
//     <main className="flex flex-col min-h-screen bg-white text-center px-6 py-8">
//       {/* Header */}
//       <header className="flex items-center mb-8">
//         <button
//           onClick={() => window.history.back()}
//           className="text-gray-800 text-base font-medium flex items-center"
//         >
//           ←
//         </button>
//         <h1 className="flex-1 text-lg font-semibold text-gray-900">Delete Account</h1>
//       </header>

//       {/* Main Content */}
//       <section className="flex-1 flex flex-col items-center max-w-xl mx-auto space-y-6">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="bg-red-50 p-4 rounded-full">
//             <AlertCircle className="text-red-500 w-8 h-8" />
//           </div>

//           <div>
//             <h2 className="text-2xl font-semibold text-gray-900">Are you sure?</h2>
//             <p className="text-gray-600 mt-2 max-w-sm">
//               Deleting your account is a permanent action and cannot be undone.
//               All your data, including your profile, skills, and messages, will be
//               permanently removed.
//             </p>
//           </div>
//         </div>

//         {/* Password Input */}
//         <div className="w-full text-gray">
//           <Input
//             type="password"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password to confirm"
//             className="w-full"
//           />
//         </div>

//         {/* Checkbox */}
//         <div className="flex items-start space-x-3 text-left w-full">
//           <input
//             type="checkbox"
//             id="confirmDelete"
//             checked={checked}
//             onChange={(e) => setChecked(e.target.checked)}
//             className="mt-1 w-4 h-4 accent-red-500"
//           />
//           <label htmlFor="confirmDelete" className="text-sm text-gray-700 leading-snug">
//             I understand this action is irreversible and I want to permanently
//             delete my account.
//           </label>
//         </div>
//       </section>

//       {/* Delete Button */}
//       <footer className="mt-auto w-full max-w-xl mx-auto">
//         <Button
//           onClick={handleDelete}
//           className={`py-3 text-lg font-semibold w-full ${
//             checked && password.trim()
//               ? 'bg-[#F87171]'
//               : 'bg-red-300 cursor-not-allowed'
//           }`}
//         >
//           Delete My Account
//         </Button>
//       </footer>
//     </main>
//   );
// };

// export default DeleteAccount;
