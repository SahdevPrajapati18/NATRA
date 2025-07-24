import React, { createContext, useContext, useEffect, useState, useMemo, } from "react";
import {
    auth,
    db,
    appId,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut,
    doc,
    setDoc,
    getDoc,
} from "./firebase.jsx";

// --- CONTEXT ---
const AuthContext = createContext();
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

// --- PROVIDER ---
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const clearError = () => setError(null);

    // --- USER PROFILE SETUP ---
    const createUserProfileDocument = async (user, additionalData = {}) => {
        if (!user) return;
        const userRef = doc(db, `artifacts/${appId}/users`, user.uid);
        const snapshot = await getDoc(userRef);

        const { displayName, email, photoURL, uid } = user;
        let finalDisplayName =
            additionalData.displayName ||
            displayName ||
            (email ? email.split("@")[0] : "");

        finalDisplayName =
            finalDisplayName.charAt(0).toUpperCase() + finalDisplayName.slice(1);

        const baseProfile = {
            uid,
            displayName: finalDisplayName,
            email,
            photoURL,
            joined: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            ...additionalData,
        };

        if (!snapshot.exists()) {
            await setDoc(userRef, baseProfile);
            return baseProfile;
        } else {
            await setDoc(
                userRef,
                { lastLogin: new Date().toISOString() },
                { merge: true }
            );
            return { uid: user.uid, ...snapshot.data() };
        }
    };

    // --- AUTH METHODS ---
    const signInWithGoogle = async () => {
        clearError();
        const provider = new GoogleAuthProvider();

        try {
            const { user } = await signInWithPopup(auth, provider);
            const profile = await createUserProfileDocument(user);
            return { success: true, user: profile };
        } catch (err) {
            console.error("Google Sign-In Error:", err);
            let msg = "Failed to sign in with Google";
            if (err.code === "auth/popup-closed-by-user") msg = "Sign-in cancelled";
            if (err.code === "auth/popup-blocked")
                msg = "Popup blocked. Please allow popups and try again.";
            setError(msg);
            return { success: false, error: msg };
        }
    };

    const signUpWithEmail = async (email, password, firstName, lastName) => {
        clearError();
        if (password.length < 6) {
            const msg = "Password must be at least 6 characters";
            setError(msg);
            return { success: false, error: msg };
        }

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            const displayName = `${firstName} ${lastName}`.trim();
            await updateProfile(user, { displayName });
            const profile = await createUserProfileDocument(user, { displayName });
            return { success: true, user: profile };
        } catch (err) {
            console.error("Email Sign-Up Error:", err);
            const msgMap = {
                "auth/email-already-in-use": "This email is already registered. Please log in.",
                "auth/invalid-email": "Invalid email address",
                "auth/weak-password": "Password is too weak",
            };
            const msg = msgMap[err.code] || "Failed to create account. Try again.";
            setError(msg);
            return { success: false, error: msg };
        }
    };

    const signInWithEmail = async (email, password) => {
        clearError();
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            const profile = await createUserProfileDocument(user);
            return { success: true, user: profile };
        } catch (err) {
            console.error("Email Sign-In Error:", err);
            const msgMap = {
                "auth/user-not-found": "Invalid email or password.",
                "auth/wrong-password": "Invalid email or password.",
                "auth/invalid-credential": "Invalid credentials.",
                "auth/too-many-requests": "Too many attempts. Try again later.",
                "auth/user-disabled": "This account has been disabled.",
            };
            const msg = msgMap[err.code] || "Failed to sign in. Please try again.";
            setError(msg);
            return { success: false, error: msg };
        }
    };

    const signOutUser = async () => {
        try {
            await signOut(auth);
            setUser(null); // Update immediately for smoother UX
            return { success: true };
        } catch (err) {
            console.error("Sign-out error:", err);
            setError("Failed to sign out");
            return { success: false, error: "Failed to sign out" };
        }
    };

    const resetPassword = async (email) => {
        clearError();
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true, message: "Password reset email sent!" };
        } catch (err) {
            console.error("Reset Password Error:", err);
            const msgMap = {
                "auth/user-not-found": "No account found with this email.",
                "auth/invalid-email": "Invalid email address.",
            };
            const msg = msgMap[err.code] || "Failed to send reset email.";
            setError(msg);
            return { success: false, error: msg };
        }
    };

    const isAuthenticated = () => !!user && !user.isAnonymous;

    // --- HANDLE AUTH STATE CHANGES ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const profile = await createUserProfileDocument(currentUser);
                    setUser({ ...currentUser, ...profile });
                } catch (err) {
                    console.error("Auth State Error:", err);
                    setError("An authentication error occurred.");
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        error,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOutUser,
        isAuthenticated,
        clearError,
        resetPassword,
    }), [user, loading, error]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// --- UI COMPONENTS ---

// --- LOGIN FORM ---
export const EnhancedLoginForm = ({ toggleView, onNavigate, setView }) => {
    const { signInWithEmail, signInWithGoogle, error, clearError } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (error) clearError();
        if (localError) setLocalError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLocalError('');
        clearError();
        const result = await signInWithEmail(formData.email, formData.password);
        if (result.success) {
            onNavigate('profile');
        } else {
            setLocalError(result.error);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        clearError();
        const result = await signInWithGoogle();
        if (result.success) {
            onNavigate('profile');
        }
        setLoading(false);
    };

    const displayError = localError || error;

    return (
        <div className="auth-form-container">
            {/* Form JSX from previous versions */}
        </div>
    );
};

// --- SIGNUP FORM ---
export const EnhancedSignupForm = ({ toggleView, onNavigate }) => {
    const { signUpWithEmail, signInWithGoogle, error, clearError } = useAuth();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    // ... (Handler logic is the same as previous versions)

    return (
        <div className="auth-form-container">
            {/* Form JSX from previous versions */}
        </div>
    );
};

// --- FORGOT PASSWORD FORM ---
export const ForgotPasswordForm = ({ setView }) => {
    const { resetPassword } = useAuth(); // Use the context function
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        const result = await resetPassword(email);
        if (result.success) {
            setMessage(result.message);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="login-form-container">
            <h2>Reset Your Password</h2>
            <p className="form-description">
                Enter your email to receive a password reset link.
            </p>
            <form onSubmit={handlePasswordReset}>
                <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <div className="auth-form-links">
                <p>
                    <button onClick={() => setView('login')} className="link-button">
                        &larr; Back to Login
                    </button>
                </p>
            </div>
        </div>
    );
};

// --- GOOGLE ICON ---
const GoogleIcon = () => (
    <svg height="24" width="24" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
        {/* SVG paths */}
    </svg>
);
