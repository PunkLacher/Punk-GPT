import { useState, useEffect } from "react";

function App() {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  //create new chat button clears current chat state
  function createNewChat() {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  }

  //sets clicked chat title as the current chat, clears prompt and response from state
  function handleClick(uniqueTitle) {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  }


  async function getMessages() {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      // console.log(data)
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log("ct: " + currentTitle, "v: " + value, "m: " + message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [currentTitle, message]);

  console.log(previousChats);

  //set current chat
  const currentChat = previousChats.filter(
    (prevChat) => prevChat.title === currentTitle
  );

  //create array of all unique chat titles
  const uniqueTitles = Array.from(new Set(previousChats.map(prevChat => prevChat.title)))

  console.log(uniqueTitles)

  

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Powered by Punklacher</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h2>PunkGPT</h2>}

        <ul className="feed">
          {currentChat?.map((chatMessage, index) => {
            const role = chatMessage.role;
            const capRole = role.toUpperCase() + ":";
            return (
              <li key={index}>
                <p className="role">{capRole}</p>
                <p>{chatMessage.content}</p>
              </li>
            );
          })}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <textarea
              className="input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              multiline={true}
            />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className="info">Punk GPT, v1.00. Free Research Preview.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
