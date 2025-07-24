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
    signInAnonymously, // Ensure signInAnonymously is imported
    doc,
    setDoc,
    getDoc,
} from "./firebase.jsx"; // Corrected file extension

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

        if(finalDisplayName) {
            finalDisplayName =
                finalDisplayName.charAt(0).toUpperCase() + finalDisplayName.slice(1);
        }

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
            setUser(null); // This will trigger onAuthStateChanged to sign in anonymously
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

    // --- UPDATED: More robust auth state handling ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // User is signed in (either real or anonymous)
                try {
                    const profile = await createUserProfileDocument(currentUser);
                    setUser({ ...currentUser, ...profile });
                } catch (err) {
                    console.error("Auth State Error:", err);
                    setError("An authentication error occurred.");
                    setUser(null);
                }
            } else {
                // No user is signed in, so sign in anonymously.
                // This will re-trigger onAuthStateChanged.
                signInAnonymously(auth).catch(err => {
                    console.error("Anonymous sign-in failed:", err);
                    setError("Could not start a guest session.");
                });
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
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
            {!loading && children}
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
            <div className="form-header">
                <h2>Welcome Back</h2>
                <p>New to NATRA? 
                    <a href="#signup" onClick={(e) => { e.preventDefault(); toggleView(); }}>
                        Create an Account
                    </a>
                </p>
            </div>
            
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" value={formData.email} onChange={handleInputChange} required disabled={loading} />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={formData.password} onChange={handleInputChange} required disabled={loading} />
                </div>
                
                {displayError && <p className="form-error">{displayError}</p>}
                
                <div className="form-options">
                    <button type="button" onClick={() => setView('forgot')} className="link-button">
                        Forgot Password?
                    </button>
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging In...' : 'Log In'}
                </button>
            </form>
            
            <div className="social-divider">
                <span>Or Log In With</span>
            </div>
            
            <div className="social-buttons">
                <button className="btn btn-social" onClick={handleGoogleLogin} disabled={loading}>
                    <GoogleIcon /> Google
                </button>
            </div>
        </div>
    );
};

// --- SIGNUP FORM ---
export const EnhancedSignupForm = ({ toggleView, onNavigate }) => {
    const { signUpWithEmail, signInWithGoogle, error, clearError } = useAuth();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (error) clearError();
        if (localError) setLocalError('');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLocalError('');
        clearError();

        const result = await signUpWithEmail(
            formData.email,
            formData.password,
            formData.firstName,
            formData.lastName
        );

        if (result.success) {
            onNavigate('profile');
        } else {
            setLocalError(result.error);
        }
        setLoading(false);
    };

    const handleGoogleSignup = async () => {
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
            <div className="form-header">
                <h2>Create an Account</h2>
                <p>Already a member? 
                    <a href="#login" onClick={(e) => { e.preventDefault(); toggleView(); }}>
                        Log In
                    </a>
                </p>
            </div>
            
            <form onSubmit={handleSignup}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} required disabled={loading} />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" value={formData.email} onChange={handleInputChange} required disabled={loading} />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={formData.password} onChange={handleInputChange} required disabled={loading} minLength={6} />
                </div>
                
                {displayError && <p className="form-error">{displayError}</p>}
                
                <div className="form-terms">
                    <input type="checkbox" id="terms" required disabled={loading} />
                    <label htmlFor="terms">I agree to the Terms & Conditions</label>
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                </button>
            </form>
            
            <div className="social-divider">
                <span>Or Register With</span>
            </div>
            
            <div className="social-buttons">
                <button className="btn btn-social" onClick={handleGoogleSignup} disabled={loading}>
                    <GoogleIcon /> Google
                </button>
            </div>
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
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
        <path d="M1 1h22v22H1z" fill="none"></path>
    </svg>
);
