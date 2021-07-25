import React, { useState, useEffect } from 'react';
import userList from 'services/users.json';
import { makeId } from 'services/functions';

require('./css/App.scss');

interface IUser {
  id: string;
  name: {
    given: string;
    surname: string;
  };
  points: number;
  animals: string[];
  isActive: boolean;
  age: number;
}

function App(): JSX.Element {
  const [animalsList, setAnimalsList] = useState<string[]>([]);
  const [limit, setLimit] = useState(10);
  const [users, setUpdateUserList] = useState(userList);
  const [userInfo, setUserInfo] = useState('');
  const [score, setScore] = useState('');

  const returnUsers = (usersMatchList: Array<IUser>) => {
    return usersMatchList
      .filter((item: IUser, idx: number) => idx < limit)
      .map((selectedUser: IUser, index: number) => {
        return (
          <tr key={index}>
            <td>{`${selectedUser.name.given} ${selectedUser.name.surname}`}</td>
            <td>{selectedUser.points}</td>
            <td>{String(selectedUser.isActive)}</td>
            <td>
              <button
                onClick={() => {
                  setUpdateUserList(users.filter((item) => item !== selectedUser));
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      });
  };

  const animalUserList = (animalName: string) => {
    const usersMatchList = users.filter((user) => {
      return user.animals.includes(animalName) && user.isActive === true; // Filter if the user is active or not
    });
    usersMatchList.sort((a, b) => (a.points < b.points ? 1 : -1)); // Sort the list

    return (
      <>
        <h5> {animalName} </h5>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{returnUsers(usersMatchList)}</tbody>
        </table>
      </>
    );
  };

  useEffect(() => {
    // Since there is no async call we could put these statements at the beginning of the component but in production we would obviously need an api call, thus we would use this hook

    let animals: string[] = [];
    users.forEach((animalsProp) => {
      if (animalsProp.isActive) {
        // Not sure if an user with 'isActive' false should provide his array of animals
        animals = [...animals, ...animalsProp.animals]; // Use spread operator to merge both arrays
        animals = animals.filter((item, pos) => animals.indexOf(item) === pos); // Filter removing duplicates
      }
    });
    setAnimalsList(animals);
  }, []);

  if (animalsList?.length === 0) {
    return <div>Loading </div>;
  } else {
    return (
      <>
        <div className="wrapper">
          <aside>
            <h4>Animals List</h4>
            {animalsList.map((animalName, index) => {
              return (
                <div className="animal-name" key={index}>
                  {animalName}
                </div>
              );
            })}
            <div>
              <div>Total users (enabled + disabled): {users.length}</div>
            </div>
          </aside>
          <div>
            <h1>Animal Lovers Blog</h1>
            <div className="add-user">
              <h5>Add user</h5>
              Name and surname:
              <input type="text" value={userInfo} onChange={(e) => setUserInfo(e.currentTarget.value)} />
              Score: <input type="text" value={score} onChange={(e) => setScore(e.currentTarget.value)} />
              <button
                onClick={() => {
                  if (userInfo !== '' && score !== '') {
                    setUpdateUserList(
                      users.concat({
                        id: makeId(24),
                        name: {
                          given: userInfo.split(' ')[0],
                          surname: userInfo.split(' ')[1],
                        },
                        points: Number(score),
                        animals: [
                          'elephant',
                          'penguin',
                          'kangaroo',
                          'dog',
                          'lion',
                          'zebra',
                          'jaguar',
                          'koala',
                          'monkey',
                          'panda',
                          'horse',
                          'gorilla',
                          'bear',
                          'jaguar',
                        ],
                        isActive: true,
                        age: 31,
                      }),
                    );
                    setUserInfo('');
                    setScore('');
                  } else {
                    alert('Please, fill the input fields');
                  }
                }}
              >
                Add
              </button>
              <button className="show-more" onClick={() => setLimit(limit === 10 ? 25 : 10)}>{`Show ${
                limit === 10 ? 25 : 10
              }`}</button>
            </div>
            <div className="animals-list">
              {animalsList.map((animalName, index) => {
                return <div key={index}>{animalUserList(animalName)}</div>;
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
