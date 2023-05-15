import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const { id } = router.query;

  useEffect(() => {
    (async () => {
      if (isLoading) return;
      setIsLoading(true);
      console.log(id);
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        router.replace("/");
      }

      const ourUser = await axios.get(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(ourUser.data);
      setIsLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return <h1>Loading...</h1>;
  }

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        bio: inputRef.current.value,
      },
    });
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <p>{JSON.stringify(user)}</p>

      <input ref={inputRef} type="text" placeholder="Bio" />

      <button onClick={() => handleUpdate()}>Update</button>
    </div>
  );
}
