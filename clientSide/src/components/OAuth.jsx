import { GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import { app } from "../firebase";
import { useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../../redux/slices/userSlice";

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const HandleGoogleClick = async () => {
        try {
            const auth = getAuth(app);

            
            const currentUser = auth.currentUser;

            if (currentUser) {
                
                const { displayName, email, photoURL, uid } = currentUser;
                const result = { user: { displayName, email, photoURL, uid } };
                const res = await fetch('/api/auth/google', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
                });
                const data = await res.json();
                dispatch(signInSuccess(data));
                navigate("/");
            } else {
                // User is not signed in, proceed with sign-in
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);

                const res = await fetch('/api/auth/google', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
                });
                const data = await res.json();
                dispatch(signInSuccess(data));
                navigate("/");
            }
        } catch (error) {
            console.log("Unable to sign in with Google", error);
        }
    }

    return (
        <button onClick={HandleGoogleClick} type="button" className="bg-red-700 text-white p-3 rounded-lg 
            uppercase hover:opacity-95">Continue with Google</button>
    );
}

export default OAuth;
