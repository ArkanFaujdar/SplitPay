import React from "react";

let initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friend, setFriends] = React.useState(initialFriends);
  const [add, setAdd] = React.useState(false);
  const [selectFriend, setSelectFriend] = React.useState(null);

  function handleSelectedFriend(friend) {
    setSelectFriend((friends) => (friends === friend ? null : friend));
    setAdd(false);
  }
  function SetSplitBill(value) {
    setFriends(
      friend.map((friend) =>
        friend.name === selectFriend.name
          ? { ...friend, balance: friend.balance + value }
          : { ...friend }
      )
    );
    setSelectFriend(null);
  }

  return (
    <div className="container w-full mx-[auto] md:px-[150px] pt-[50px]">
      <p className="pb-11 m-auto p-0 text-center">SplitPay</p>
      <div className="grid grid-cols-1 mx-8 sm:grid-cols-2">
        <div className="sidebar mb-10 sm:mb-auto">
          <FriendsList
            friends={friend}
            handleSelectedFriend={handleSelectedFriend}
            key={Date.now}
            selectFriend={selectFriend}
            setFriends={setFriends}
          />

          {add ? (
            <AddFriendForm setFriends={setFriends} setAdd={setAdd} />
          ) : (
            <></>
          )}

          <button
            className="button"
            onClick={() => {
              setAdd(!add);
              setSelectFriend(null);
            }}
          >
            {add ? "Close" : "Add Friend"}
          </button>
        </div>
        {selectFriend && (
          <SplitBill
            selectFriend={selectFriend}
            SetSplitBill={SetSplitBill}
            key={selectFriend.name}
            setFriends={setFriends}
          />
        )}
      </div>
    </div>
  );
}

function FriendsList({
  friends,
  handleSelectedFriend,
  setFriends,
  selectFriend,
}) {
  return (
    <ul>
      {friends.map((friend) => (
        <List
          key={friend.id}
          friend={friend}
          selectFriend={selectFriend}
          handleSelectedFriend={handleSelectedFriend}
          setFriends={setFriends}
        />
      ))}
    </ul>
  );
}

function List({ friend, handleSelectedFriend, selectFriend }) {
  return (
    <li className={selectFriend?.name === friend.name ? "selected" : ""}>
      <h3>{friend.name}</h3>
      <img src={friend.image} alt={friend.name} />

      {friend.balance > 0 ? (
        <p className="green">{friend.name + " owes You $ " + friend.balance}</p>
      ) : friend.balance < 0 ? (
        <p className="red">
          {"You owe " + friend.name + " $ " + Math.abs(friend.balance)}
        </p>
      ) : (
        <p>{"You and " + friend.name + " are even"}</p>
      )}
      <button className="button" onClick={() => handleSelectedFriend(friend)}>
        {selectFriend?.name === friend.name ? "Close" : "Select"}
      </button>
    </li>
  );
}

// Adding a new friend
function AddFriendForm({ setFriends, selectFriend, setAdd }) {
  const [name, setName] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("https://i.pravatar.cc/48?u=");

  function handleAddFriendSubmit(e) {
    e.preventDefault();
    if (name === "") {
      return;
    }
    const newFriend = {
      id: crypto.randomUUID,
      name,
      balance: 0,
      image: `${imageUrl} + ${10000 + Math.random()}`,
    };
    setFriends((friend) => [...friend, newFriend]);
    setName("");
    setAdd((add) => !add);
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddFriendSubmit}>
      <label>👬 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      ></input>
      <label>👬 Image Url</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => {
          setImageUrl(e.target.value);
        }}
      ></input>
      <button className="button">Add friend</button>
    </form>
  );
}

//Select a Friend to Split Expenses
function SplitBill({ selectFriend, SetSplitBill, setFriends }) {
  const [bill, setBill] = React.useState("");
  const [yourExp, setYourExp] = React.useState("");
  const [paidBy, setPaidBy] = React.useState("user");
  const friendsExpense = bill > 0 ? bill - yourExp : "";

  function handleSplitSubmit(e) {
    e.preventDefault();
    if (!bill || !yourExp) return;

    SetSplitBill(paidBy === "user" ? friendsExpense : -yourExp);
  }

  return (
    <form
      className="form-split-bill mb-11 sm:ml-[20px]"
      onSubmit={handleSplitSubmit}
    >
      <h2 className="text-[20px] sm:text-[25px]">
        Split bill with {selectFriend.name}
      </h2>
      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>🧍‍♂️ Your Expense</label>
      <input
        type="text"
        value={yourExp}
        onChange={(e) =>
          setYourExp(
            Number(e.target.value) > bill ? yourExp : Number(e.target.value)
          )
        }
      ></input>
      <label>👬 {selectFriend.name} Expense</label>
      <input type="text" disabled={true} value={friendsExpense}></input>
      <label>🤑 Who is paying</label>
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectFriend.name}</option>
      </select>
      <button className="button">Split Bill</button>
    </form>
  );
}
