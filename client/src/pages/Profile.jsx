import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {

    const [profile, setProfile] = useState(null);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await api.get("/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProfile(response.data);

            } catch (error) {

                console.log(error.response.data);

            }

        };

        fetchProfile();

    }, []);

    if (!profile) {

        return <h2>Loading Hunter Profile...</h2>;

    }

    return (

        <div>

            <h1>⚔️ HUNTER PROFILE ⚔️</h1>

            <h2>Welcome {profile.username}</h2>

            <p>Email : {profile.email}</p>

            <p>Role : {profile.role}</p>

        </div>

    );

}

export default Profile;