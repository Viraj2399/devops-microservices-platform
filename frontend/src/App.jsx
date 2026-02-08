import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-600">
        DevOps Microservices Platform 🚀
      </h1>

      <h2 className="mt-6 text-xl font-semibold">Users:</h2>
      <ul className="mt-2">
        {users.map((u) => (
          <li key={u.id} className="p-2 border rounded mt-2">
            {u.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
