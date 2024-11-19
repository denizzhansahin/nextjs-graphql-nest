'use client';

import { gql, useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';

const GET_USERS = gql`
  query {
    getUsers {
      id
      username
      settings {
        userId
        receiveEmails
        receiveNotifications
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $displayName: String!) {
    createUser(
      createdUserData: {
        username: $username
        displayName: $displayName
      }
    ) {
      id
      username
      displayName
    }
  }
`;

const CREATE_USER_SETTING = gql`
  mutation CreateUserSettings($userId: Int!, $receiveNotifications: Boolean!, $receiveEmails: Boolean!) {
    createUserSettings(
      createUserSettingData: {
        userId: $userId
        receiveNotifications: $receiveNotifications
        receiveEmails: $receiveEmails
      }
    ) {
      userId
      receiveNotifications
      receiveEmails
    }
  }
`;

export default function Home() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [createUserSettings] = useMutation(CREATE_USER_SETTING);

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(false);

  const [shouldRefetch, setShouldRefetch] = useState(false);

  useEffect(() => {
    if (shouldRefetch) {
      refetch(); // Kullanıcı listesini yeniden yükler
      setShouldRefetch(false); // Tekrar yüklenmesini engellemek için durumu sıfırla
    }
  }, [shouldRefetch, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCreateUser = async () => {
    try {
      const result = await createUser({
        variables: { username, displayName },
      });
      alert(`User Created: ${result.data.createUser.username}`);
      setShouldRefetch(true); // Veriyi yeniden yüklemek için flag'i aktif et
    } catch (e) {
      console.error(e);
      alert('Failed to create user');
    }
  };

  const handleCreateUserSettings = async () => {
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      alert('Invalid User ID');
      return;
    }

    try {
      const result = await createUserSettings({
        variables: { userId: parsedUserId, receiveNotifications, receiveEmails },
      });
      alert(`Settings Updated for User ID: ${result.data.createUserSettings.userId}`);
      setShouldRefetch(true); // Veriyi yeniden yüklemek için flag'i aktif et
    } catch (e) {
      console.error(e);
      alert('Failed to update user settings');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* List Users */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">User List</h2>
        <ul>
          {data.getUsers.map((user) => (
            <li key={user.id}>
              {user.id} - {user.username} | Notifications: {user.settings?.receiveNotifications?.toString()} | Emails: {user.settings?.receiveEmails?.toString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Create User Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Create User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateUser();
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Create User
          </button>
        </form>
      </div>

      {/* Create User Settings Form */}
      <div>
        <h2 className="text-xl font-semibold">Update User Settings</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateUserSettings();
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-2 rounded"
          />
          <div className="flex gap-4 items-center">
            <label>
              <input
                type="checkbox"
                checked={receiveNotifications}
                onChange={(e) => setReceiveNotifications(e.target.checked)}
              />
              Receive Notifications
            </label>
            <label>
              <input
                type="checkbox"
                checked={receiveEmails}
                onChange={(e) => setReceiveEmails(e.target.checked)}
              />
              Receive Emails
            </label>
          </div>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Update Settings
          </button>
        </form>
      </div>
    </div>
  );
}
