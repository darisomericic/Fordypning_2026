import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";


function App() {

const [navn, setNavn] = useState("");
const [epost, setEpost] = useState("");
const [tjeneste, setTjeneste] = useState("");


const handleBestill = async () => {
   if (!navn || !epost || !tjeneste) { // om ingenting er fylt ut 
    alert("Fyll ut alle feltene!"); // vises denne meldingen
    return;
  }

  if (!/\S+@\S+\.\S+/.test(epost)) { // om eposten ikke er gyldig 
    alert("Vennligst oppgi en gyldig e-postadresse!"); // vises denne meldingen
    return;
  }

    const response = await fetch("http://localhost:5000/bestill", { // URL til backend-endepunktet
          method: 'POST', // metoden 
          headers: { "Content-Type": "application/json" },  //  denne er viktig for å fortelle backend at vi sender JSON
        body: JSON.stringify({ navn, epost, tjeneste })  // variabler fra state
    });
    const data = await response.json(); // svar fra backend
    return (alert(data.message) // viser melding fra backend
    );
};


  return (

    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button >Bestill time!</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(5px)",
            zIndex: 9998,
          }}
        />

        <Dialog.Content
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            width: "90vw",
            maxWidth: "450px",
            backgroundColor: "#37383E",
            color: "#CCD7D8",
            padding: "2rem",
            borderRadius: "1.25rem",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          }}
        >
          <div style={{ position: "relative" }}>
            <Dialog.Title
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
              }}
            >
              Personopplysninger:
            </Dialog.Title>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                padding: "1.5rem 0",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <input style={{ padding: "5px", borderRadius: "5px" }} type="text" placeholder="Fullt navn..." onChange={(e) => setNavn(e.target.value)} value={navn} required/>
              <input style={{ padding: "5px", borderRadius: "5px" }} type="text" placeholder="Din e-post..."   onChange={(e) => setEpost(e.target.value)} value={epost} required/>
            </div>

            <h3 style={{ fontSize: "17px", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "1rem 0" }}>
              Velg tjeneste:
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {["Herreklipp", "Seniorklipp", "Barneklipp", "Maskinklipp", "Barbering", "Maskinbarbering"].map((tjeneste, i) => (
                <label key={i}>
                  <input type="radio" name="behandling" value={tjeneste.toLowerCase()}  onChange={(e) => setTjeneste(e.target.value)} required/> {tjeneste}
                </label>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button onClick={handleBestill}>Bestill</button>
            </div>

            <Dialog.Close
              style={{
                position: "absolute",
                top: "-1rem",
                right: "-1rem",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "5px",
              }}
            >
              <X size={25} color="#CCD7D8" />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default App
