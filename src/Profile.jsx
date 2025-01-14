import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { silentJSON, processAlert } from "./FetchRoutines";
import jwtDecode from "jwt-decode";
function Profile() {
    useEffect(() => { getProfile() }, []);
    let nameInput = useRef();
    let phoneInput = useRef();
    let emailInput = useRef();

    const jwt = useContext(AuthContext);
    const [profile, setProfile] = useState();


    function getProfile() {
        const headers = { "Authorization": "Bearer " + jwt };

        fetch(`http://localhost:8085/profile/${getUserIdFromJwt()}`, { method: "GET", headers: headers }).then(silentJSON)
            .then(response => { setProfile(response) });
    }
    function getUserIdFromJwt() {
        try {
            const decodedJwt = jwtDecode(jwt);
            const id = parseInt(decodedJwt.id);
            return id // Assuming the user ID is stored in 'id' claim
        } catch (error) {

            return null;
        }
    }
    function updateProfile() {
        const headers = { "Authorization": "Bearer " + jwt, "Content-type": "application/json; charset=UTF-8" };
        const toPost = { fullname: nameInput.current.value, phone: phoneInput.current.value, email: emailInput.current.value };
        fetch("http://localhost:8085/profile/update", {
            method: "POST",
            body: JSON.stringify(toPost),
            headers: headers
        }).then(response => processAlert(response, "Profile updated."));
    }
    function createProfile() {
        const headers = { "Authorization": "Bearer " + jwt, "Content-type": "application/json; charset=UTF-8" };
        const toPost = { fullname: nameInput.current.value, phone: phoneInput.current.value, email: emailInput.current.value };
        fetch("http://localhost:8085/profile/create", {
            method: "POST",
            body: JSON.stringify(toPost),
            headers: headers
        }).then(response => processAlert(response, "Profile created."));
    }

    if (jwt.length == 0)
        return (
            <p>You are not logged in to your account.</p>
        );
    else if (profile)
        return (
            <>
                <h4>Edit your profile</h4>
                <p>Your name: <input type="text" ref={nameInput} defaultValue={profile.fullname} /></p>
                <p>Your phone: <input type="text" ref={phoneInput} defaultValue={profile.phone} /></p>
                <p>Your email: <input type="text" ref={emailInput} defaultValue={profile.email} /></p>
                <p><button onClick={updateProfile}>Update Profile</button></p>
            </>
        );
    else
        return (
            <>
                <h4>Create your profile</h4>
                <p>Your name: <input type="text" ref={nameInput} /></p>
                <p>Your phone: <input type="text" ref={phoneInput} /></p>
                <p>Your email: <input type="text" ref={emailInput} /></p>
                <p><button onClick={createProfile}>Create Profile</button></p>
            </>
        );
}

export default Profile;