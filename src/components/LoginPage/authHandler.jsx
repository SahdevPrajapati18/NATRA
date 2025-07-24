import React, { useState, useEffect, createContext, useContext } from 'react';
import {
    auth,
    db,
    appId,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
    signInAnonymously,
    doc,
    setDoc,
    getDoc
} from './firebase.jsx';

// --- AUTHENTICATION CONTEXT ---
const AuthContext = createContext();

// --- CUSTOM HOOK ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// --- AUTHENTICATION PROVIDER COMPONENT ---
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to create/update user profile document in Firestore
    const createUserProfileDocument = async (user, additionalData = {}) => {
        if (!user) return;
        
        const userRef = doc(db, `artifacts/${appId}/users`, user.uid);
        
        try {
            const snapshot = await getDoc(userRef);
            
            if (!snapshot.exists()) {
                const { displayName, email, photoURL, uid } = user;

                // Create a display name from email if one doesn't exist
                let finalDisplayName = additionalData.displayName || displayName;
                if (!finalDisplayName && email) {
                    const emailName = email.split('@')[0];
                    finalDisplayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
                }

                const userProfile = {
                    uid,
                    displayName: finalDisplayName,
                    email,
                    photoURL,
                    joined: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    ...additionalData,
                };
                await setDoc(userRef, userProfile);
                return userProfile;
            } else {
                await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
                return { uid: user.uid, ...snapshot.data() };
            }
        } catch (err) {
            console.error("Error managing user profile:", err);
            setError("Failed to manage user profile");
            throw err;
        }
    };

    // Google Sign-In
    const signInWithGoogle = async () => {
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const userProfile = await createUserProfileDocument(result.user);
            return { success: true, user: userProfile };
        } catch (err) {
            console.error("Google sign-in error:", err);
            let errorMessage = "Failed to sign in with Google";
            if (err.code === 'auth/popup-closed-by-user') {
                errorMessage = "Sign-in cancelled";
            } else if (err.code === 'auth/popup-blocked') {
                errorMessage = "Popup blocked. Please allow popups and try again.";
            }
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Email/Password Sign-Up
    const signUpWithEmail = async (email, password, firstName, lastName) => {
        setError(null);
        if (password.length < 6) {
            const errorMessage = "Password should be at least 6 characters";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
        try {
            const { user: authUser } = await createUserWithEmailAndPassword(auth, email, password);
            const displayName = `${firstName} ${lastName}`.trim();
            await updateProfile(authUser, { displayName });
            const userProfile = await createUserProfileDocument(authUser, { displayName });
            return { success: true, user: userProfile };
        } catch (err) {
            console.error("Email sign-up error:", err);
            let errorMessage;
            switch (err.code) {
                case 'auth/email-already-in-use':
                    errorMessage = "This email is already registered. Please log in.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Invalid email address";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Password is too weak";
                    break;
                default:
                    errorMessage = "Failed to create account. Please try again.";
            }
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Email/Password Sign-In
    const signInWithEmail = async (email, password) => {
        setError(null);
        try {
            const { user: authUser } = await signInWithEmailAndPassword(auth, email, password);
            const userProfile = await createUserProfileDocument(authUser);
            return { success: true, user: userProfile };
        } catch (err) {
            console.error("Email sign-in error:", err);
            let errorMessage;
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password. Please try again.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many failed attempts. Please try again later.";
                    break;
                case 'auth/user-disabled':
                    errorMessage = "This account has been disabled.";
                    break;
                default:
                    errorMessage = "Failed to sign in. Please try again.";
            }
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Sign Out
    const signOutUser = async () => {
        setError(null);
        try {
            await signOut(auth);
            return { success: true };
        } catch (err) {
            console.error("Sign-out error:", err);
            const errorMessage = "Failed to sign out";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Check if user is authenticated (and not an anonymous guest)
    const isAuthenticated = () => {
        return user && !user.isAnonymous;
    };

    // --- UPDATED: More robust auth state listener effect ---
    useEffect(() => {
        let isMounted = true; // Track if component is mounted

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    // User is signed in
                    const userProfile = await createUserProfileDocument(currentUser);
                    if (isMounted) {
                        setUser({ ...currentUser, ...userProfile });
                    }
                } else {
                    // No user is signed in, attempt anonymous sign-in
                    if (isMounted) {
                        signInAnonymously(auth).catch(err => {
                            console.error("Anonymous sign-in failed:", err);
                            setError("Failed to get guest access.");
                        });
                    }
                }
            } catch (err) {
                console.error("Error in auth state change:", err);
                if (isMounted) {
                    setError("An authentication error occurred.");
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);


    const clearError = () => setError(null);

    const value = {
        user,
        loading,
        error,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOutUser,
        isAuthenticated,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


// --- SIGNUP FORM COMPONENT ---
export const EnhancedSignupForm = ({ toggleView, onNavigate, onSuccess }) => {
    const { signUpWithEmail, signInWithGoogle, error, clearError } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
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
            onSuccess?.();
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
            onSuccess?.();
            onNavigate('profile');
        }
        setLoading(false);
    };

    const displayError = error || localError;

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


// --- LOGIN FORM COMPONENT ---
export const EnhancedLoginForm = ({ toggleView, onNavigate, onSuccess }) => {
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
            onSuccess?.();
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
            onSuccess?.();
            onNavigate('profile');
        }
        setLoading(false);
    };

    const displayError = error || localError;

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
                    <a href="#forgot">Forgot Password?</a>
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


// --- GOOGLE ICON COMPONENT ---
const GoogleIcon = () => (
    <svg height="24" width="24" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
        <path d="M1 1h22v22H1z" fill="none"></path>
    </svg>
);
