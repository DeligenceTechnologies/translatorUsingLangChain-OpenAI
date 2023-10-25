import "./App.css";
import { React, useEffect, useState } from "react";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { ChatPromptTemplate } from "langchain/prompts";
import Modal from "react-bootstrap/Modal";
import { Row, Col, Table } from "react-bootstrap";
import {
  BsChevronDown,
  BsArrowLeft,
  BsX,
  BsArrowLeftRight,
} from "react-icons/bs";
import { GoSearch } from "react-icons/go";
import { GrPowerReset } from "react-icons/gr";
import { RiTranslate } from "react-icons/ri";
import { data } from "./data";

const template =
  "You are a helpful assistant that translates {input_language} to {output_language}.";
const humanTemplate = "{text}";

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", template],
  ["human", humanTemplate],
]);

const chat = new ChatOpenAI({
  openAIApiKey: "",
  temperature: 0,
});

const chain = new LLMChain({
  llm: chat,
  prompt: chatPrompt,
});

function App() {
  const [text, setText] = useState("");
  const [inputlanguage, setInputlanguage] = useState("English");
  const [outputlanguage, setOutputlanguage] = useState("French");
  const [translation, setTranslation] = useState("");
  const [isdisabled, setIsdisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const [eng, setEng] = useState(true);
  const [chi, setChi] = useState(false);
  const [dut, setDut] = useState(false);
  const [fre, setFre] = useState(false);
  const [engOut, setOUtEng] = useState(false);
  const [chiOut, setOutChi] = useState(false);
  const [dutOut, setOutDut] = useState(false);
  const [freOut, setOutFre] = useState(true);

  const [changeIn, setChangeIn] = useState("");
  const [changeOut, setChangeOut] = useState("");

  const [keys, setKeys] = useState([]);

  const [showIn, setShowIn] = useState(false);
  const [showOut, setShowOut] = useState(false);

  const [searchBar, setSearchBar] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  const handleClose = () => setShowIn(false);
  const handleShow = () => {
    setShowIn(true);
    setSearchBar(true);
  };

  const handleCloseOut = () => {
    setShowOut(false);
  };
  const handleShowOut = () => setShowOut(true);



  const handleCall = async () => {
    console.log(inputlanguage);
    console.log(outputlanguage);
    setLoading(true);
    const result = await chain.call({
      input_language: `${inputlanguage}`,
      output_language: `${outputlanguage}`,
      text: `${text}`,
    });
    setTranslation(result.text);
    if (text.length > 0) window.sessionStorage.setItem(text, result.text);
    setIsdisabled(true);
    setLoading(false);
  };
  const handleText = (event) => {
    setText(event.target.value);
  };
  const handleInput1 = (value) => {
    setInputlanguage(value);
  };
  const handleInput2 = (value) => {
    setOutputlanguage(value);
  };
  const handleReset = () => {
    setText("");
    setTranslation("");
    setIsdisabled(false);
    handleInputClick("English");
    handleOutputClick("French");
  };

  const handleSwitch = () => {
    handleInputClick("Other");
    handleOutputClick("Other");
    switch (inputlanguage) {
      case "English": {
        handleOutputClick("English");
        break;
      }
      case "Chinese": {
        handleOutputClick("Chinese");
        break;
      }
      case "French": {
        handleOutputClick("French");
        break;
      }
      default: {
        setOutputlanguage(inputlanguage);
        setChangeOut(changeIn);
      }
    }
    switch (outputlanguage) {
      case "English": {
        handleInputClick("English");
        break;
      }
      case "Chinese": {
        handleInputClick("Chinese");
        break;
      }
      case "French": {
        handleInputClick("French");
        break;
      }
      default: {
        setInputlanguage(outputlanguage);
        setChangeIn(changeOut);
      }
    }
  };
  const handleInputClick = (value) => {
    switch (value) {
      case "English": {
        setEng(true);
        setChi(false);
        setDut(false);
        setFre(false);
        setInputlanguage(value);
        break;
      }
      case "French": {
        setFre(true);
        setChi(false);
        setEng(false);
        setDut(false);
        setInputlanguage(value);
        break;
      }
      case "Chinese": {
        setChi(true);
        setEng(false);
        setDut(false);
        setFre(false);
        setInputlanguage(value);
        break;
      }
      default: {
        setDut(true);
        setChi(false);
        setEng(false);
        setFre(false);
      }
    }
  };

  const handleOutputClick = (value) => {
    switch (value) {
      case "English": {
        setOUtEng(true);
        setOutChi(false);
        setOutDut(false);
        setOutFre(false);
        setOutputlanguage(value);
        break;
      }
      case "French": {
        setOUtEng(false);
        setOutChi(false);
        setOutDut(false);
        setOutFre(true);
        setOutputlanguage(value);
        break;
      }
      case "Chinese": {
        setOUtEng(false);
        setOutChi(true);
        setOutDut(false);
        setOutFre(false);
        setOutputlanguage(value);
        break;
      }
      default: {
        setOUtEng(false);
        setOutChi(false);
        setOutDut(true);
        setOutFre(false);
      }
    }
  };

  useEffect(() => {
    setKeys(Object.keys(sessionStorage));
  }, [active]);

  const handleDropItems = (e) => {
    setDut(e.target.id);
    setChangeIn(e.target.id);
    handleClose();
    handleInput1(e.target.id);
  };

  const handleDropOut = (e) => {
    setOutDut(e.target.id);
    setChangeOut(e.target.id);
    handleInput2(e.target.id);
    handleCloseOut();
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleCall();
  };

  return (
    <div className="App">
      <div className="appTitle">
        <span>Translation</span>
      </div>
      <div className="content">
        <div className="input">
          <div className="userInput">
            <div className="dropdown">
              <a
                onClick={() => handleInputClick("Dutch")}
                className={dut ? "active" : null}
                style={changeIn.length < 1 ? { display: "none" } : {}}
              >
                {changeIn}
              </a>
              <a
                onClick={() => handleInputClick("English")}
                className={eng ? "active" : null}
              >
                English
              </a>
              <a
                onClick={() => handleInputClick("French")}
                className={fre ? "active" : null}
              >
                French
              </a>
              <a
                onClick={() => handleInputClick("Chinese")}
                className={chi ? "active" : null}
              >
                Chinese
              </a>

              <a onClick={() => handleInputClick("Other")}>
                <BsChevronDown
                  onClick={() => {
                    setSearchInput("");
                    handleShow();
                  }}
                  className="downarrow"
                  size={25}
                />
              </a>
            </div>
            <textarea
              className="text"
              onChange={handleText}
              onKeyDown={(e) => handleEnter(e)}
              style={{
                marginTop: "15px",
                borderRadius: "8px",
                padding: "30px",
                fontSize: "18px",
                // minWidth: "170px",
                // maxWidth: "620px",
                minHeight:"164px",
                border: "1px solid rgba(0,0,0,.12)",
                // maxWidth: "33vw"
              }}
              value={text.toUpperCase()}
              placeholder="Enter the text to be translated here"
              rows={8}
            />
          </div>
          <a onClick={handleSwitch} className="switchBox">
            <svg
              width="30px"
              height="30px"
              className="switchIcon"
              aria-hidden="true"
              // style={{ marginLeft: "20px" }}
            >
              <path
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7L20 7M20 7L16 3M20 7L16 11M16 17L4 17M4 17L8 21M4 17L8 13"
              ></path>
            </svg>
          </a>
          <div className="userOutput">
            <div className="dropdown">
              <a
                onClick={() => handleOutputClick("Dutch")}
                className={dutOut ? "active" : null}
                style={changeOut.length < 1 ? { display: "none" } : {}}
              >
                {changeOut}
              </a>
              <a
                onClick={() => handleOutputClick("English")}
                className={engOut ? "active" : null}
              >
                English
              </a>
              <a
                onClick={() => handleOutputClick("French")}
                className={freOut ? "active" : null}
              >
                French
              </a>
              <a
                onClick={() => handleOutputClick("Chinese")}
                className={chiOut ? "active" : null}
              >
                Chinese
              </a>
              <a onClick={() => handleOutputClick("Other")}>
                <BsChevronDown
                  onClick={handleShowOut}
                  className="downarrow"
                  size={25}
                />
              </a>
            </div>
            <textarea
              disabled={true}
              className="text"
              style={{
                marginTop: "15px",
                borderRadius: "8px",
                padding: "30px",
                fontSize: "18px",
                minHeight:"164px",
                
              }}
              value={translation.toUpperCase()}
              placeholder={loading ? "Translating...." : "Translation"}
              rows={8}
            />
          </div>
        </div>
      </div>
      <div className={active ? "sidebar active" : "sidebar"}>
        <div className="sidebarTitle">
          <h4 >History</h4>
          <a onClick={() => setActive(false)}>Close</a>
        </div>

        <div
          style={{
            borderBottom: "1px solid #5f6368",
            float: "right",
            width: "100%",
            position: "relative",
          }}
        >
          <a
            onClick={() => sessionStorage.clear()}
            style={{ cursor: "pointer", float: "right", margin: "10px" }}
          >
            Clear all history
          </a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            marginTop: "70px",
          }}
        >
          <Table responsive >
            <tbody>
              {keys.map((item) => (
                <tr>
                  <td>{item.toUpperCase()}</td>
                  <td><BsArrowLeftRight style={{backgroundColor: "#fff"}}/></td>
                  <td>{sessionStorage.getItem(item)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal
        show={showIn}
        onHide={handleClose}
        dialogClassName="my-modal"
        centered
      >
       <div className="dropDownBox" style={{width:"100%"}}>
       <Modal.Header>
          {searchBar ? (
            <>
              <BsArrowLeft
                size={22}
                style={{ marginRight: "10px", cursor: "pointer" }}
                onClick={() => {
                  setSearchBar(!searchBar);
                  setSearchInput("");
                }}
              />
              <input
                className="inputfield"
                placeholder="Search languages"
                value={searchInput}
                style={{ width: "100%", paddingLeft: "18px", fontSize: "16px" }}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput.length > 0 ? (
                <BsX
                  size={30}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSearchInput("");
                  }}
                />
              ) : null}
            </>
          ) : (
            <>
              <Modal.Title
                style={{
                  paddingLeft: "8px",
                  fontWeight: "normal",
                  cursor: "pointer",
                }}
                onClick={() => setSearchBar(!searchBar)}
              >
                Translate From
              </Modal.Title>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                <GoSearch
                  size={20}
                  style={{ marginRight: "15px", cursor: "pointer" }}
                  onClick={() => setSearchBar(!searchBar)}
                />
                <BsX
                  size={30}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleClose();
                  }}
                />
              </div>
            </>
          )}
        </Modal.Header>
        <Modal.Body>
          <Row className="modalRow">
            {Object.entries(
              data.filter((value) =>
                value.toLowerCase().includes(searchInput.toLowerCase())
              )
            ).map(([key, value]) => {
              return (
                <>
                  {value.length < 1 ? (
                    console.log("null length")
                  ) : (
                    <Col
                      key={key}
                      xs={12}
                      md={4}
                      lg={2}
                      className="modalCol m-3 "
                      id={value}
                      onClick={(e) => handleDropItems(e)}
                    >
                      {value}
                    </Col>
                  )}
                </>
              );
            })}
          </Row>
        </Modal.Body>
       </div>
      </Modal>

      <Modal
        show={showOut}
        onHide={handleCloseOut}
        dialogClassName="my-modal"
        centered
      >
        <Modal.Header>
          {searchBar ? (
            <>
              <BsArrowLeft
                size={22}
                style={{ marginRight: "10px", cursor: "pointer" }}
                onClick={() => {
                  setSearchBar(!searchBar);
                  setSearchInput("");
                }}
              />
              <input
                className="inputfield"
                placeholder="Search languages"
                value={searchInput}
                style={{ width: "100%", paddingLeft: "18px", fontSize: "16px" }}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput.length > 0 ? (
                <BsX
                  size={30}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSearchInput("");
                  }}
                />
              ) : null}
            </>
          ) : (
            <>
              <Modal.Title
                style={{
                  paddingLeft: "8px",
                  fontWeight: "normal",
                  cursor: "pointer",
                }}
                onClick={() => setSearchBar(!searchBar)}
              >
                Translate To
              </Modal.Title>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                <GoSearch
                  size={20}
                  style={{ marginRight: "15px", cursor: "pointer" }}
                  onClick={() => setSearchBar(!searchBar)}
                />
                <BsX
                  size={30}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleCloseOut();
                  }}
                />
              </div>
            </>
          )}
        </Modal.Header>
        <Modal.Body>
          <Row className="modalRow">
            {Object.entries(
              data.filter((value) =>
                value.toLowerCase().includes(searchInput.toLowerCase())
              )
            ).map(([key, value]) => {
              return (
                <>
                  <Col
                    key={key}
                    xs={12}
                    md={4}
                    lg={2}
                    className="modalCol m-3 "
                    id={value}
                    onClick={(e) => handleDropOut(e)}
                  >
                    {value}
                  </Col>
                </>
              );
            })}
          </Row>
        </Modal.Body>
      </Modal>

      <div className="ButtonAction">
        <a disabled={isdisabled} onClick={() => handleCall()}>
          <div className="buttonBox">
            <RiTranslate className="buttonIcon" />
          </div>
          <div className="buttonTitle">Translate</div>
        </a>
        <a onClick={() => setActive(!active)}>
          <div className="buttonBox">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              focusable="false"
              className="buttonIcon"
            >
              <path d="M4 4v2.01C5.83 3.58 8.73 2 12.01 2 17.53 2 22 6.48 22 12s-4.47 10-9.99 10C6.48 22 2 17.52 2 12h2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8C9.04 4 6.47 5.61 5.09 8H8v2H2V4h2z"></path>
              <path d="M13 12V6h-2v7l4.97 3.49 1.26-1.55z"></path>
            </svg>
          </div>
          <div className="buttonTitle">History</div>
        </a>

        <a onClick={handleReset}>
          <div className="buttonBox">
            <GrPowerReset className="buttonIcon" />
          </div>
          <div className="buttonTitle">Reset</div>
        </a>
      </div>
    </div>
  );
}

export default App;
