import { GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/slices/userSlice";

const OAuth = () => {
    const dispatch = useDispatch();

    const HandleGoogleClick = async () => {
        try {
            const auth = getAuth(app);

            // Check if the user is already signed in
            const currentUser = auth.currentUser;

            if (currentUser) {
                // User is already signed in, dispatch signInSuccess
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
