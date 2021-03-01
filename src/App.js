import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [bf, setbf] = useState("");
  const [el, setel] = useState("");
  const [file, setfile] = useState("");
  const [valid, setValid] = useState(false);
  const [result, setResult] = useState();

  useEffect(() => {
    if ((bf != "") & (el != "") & (file != "")) {
      setValid(true);
    }
    if (bf === "" || el === "" || file === "") {
      setValid(false);
    }
  });

  function bfChange(e) {
    setbf(e.target.value);
  }

  function elChange(e) {
    setel(e.target.value);
  }

  function fileChange(e) {
    console.log(e.target.files[0]);
    setfile(e.target.files[0]);
  }
  async function submit(type) {
    const formData = new FormData();
    formData.append("BF", bf.toUpperCase());
    formData.append("EL", el.toUpperCase());
    formData.append("regles", file);

    if (type === "chainage-arriere") {
      text = "" 
      const res = await axios.post(
        "http://localhost:5000/chainage_arr",
        formData  
      );
      const resul = res.data
      console.log(resul)
      setResult(resul);
    } else {
      const res = await axios.post(
        "http://localhost:5000/chainage_av",
        formData
      );
      const resul = res.data
      setResult(resul);
    }
  }

  let regle_s,
    text = "";
  if (result) {
      regle_s = result.regles.map((regle) => {
        return `si (${regle.Prémisse})  alors (${regle.Actions})\n`;
      });
      console.log(result.base_de_fait)
      const msg = result.message ? result.message : "" 
      const message = `
      ${msg}
      La base de fait est : ${result.base_de_fait.join()} \n
      les regles sont : \n ${regle_s}
      `;
      text = (
        <textarea
          style={{
            backgroundColor: "#ffee93",
            border: "none",
            fontSize: "20px",
            marginTop: "2rem",
          }}
          rows="8"
          cols="50"
          disabled
        >
          {message}
        </textarea>
      );
    } 
  

  return (
    <div style={{ height: "100vh", backgroundColor: "#ffee93" }}>
      <div
        style={{
          paddingTop: "5rem",
          paddingLeft: "30rem",
          paddingRight: "30rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#f5d782",
            padding: "5rem",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            <label>Base de fait A,B </label>
            <input
              onChange={bfChange}
              type="text"
              style={{ width: "250px", height: "35px" }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            <label>Entrer l'element </label>
            <input
              onChange={elChange}
              type="text"
              style={{ width: "250px", height: "35px" }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            {/* <label>Select your FILE </label>
          <input type="file" /> */}
            <label style={{ color: "#9b5151" }}>
              <input
                onChange={fileChange}
                type="file"
                style={{ display: "none" }}
              />
              Joindre un fichier ici
            </label>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                height: "30px",
                borderRadius: "5px",
                borderWidth: "0.1px",
                margin: "5px",
                backgroundColor: "#e97878",
              }}
              disabled={!valid}
              onClick={() => {
                submit("chainage-avant");
              }}
            >
              Chainage Avant
            </button>
            <button
              style={{
                height: "30px",
                borderRadius: "5px",
                borderWidth: "0.1px",
                margin: "5px",
                backgroundColor: "#e97878",
              }}
              disabled={!valid}
              onClick={() => {
                submit("chainage-arriere");
              }}
            >
              chainage arrière
            </button>
          </div>
        </div>
        <article>{text}</article>
      </div>
    </div>
  );
}

export default App;
