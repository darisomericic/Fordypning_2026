import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

function App() {
  // state for navn, epost og tjeneste, og for valgt dato og tid.
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [tjeneste, setTjeneste] = useState("");
  const [valgtDato, setValgtDato] = useState("");
  const [valgtTid, setValgtTid] = useState("");
  const [open, setOpen] = useState(false); // state for å åpne og lukke dialogen
  const [tatteTider, setTatteTider] = useState([]); // Liste over tider som er bestilt

  useEffect(() => {
    // kjøres hele tiden dersom datoen endres
    if (!valgtDato || erStengtDag()) return; // hvis ingen dato er valgt eller det er en stengt dag, gjør den ingenting

    fetch(`http://localhost:5000/hent-bestillinger?dato=${valgtDato}`) // henter bestillinger for den valgte datoen
      .then((response) => response.json()) // konverterer svarene til json når de er klare
      .then((data) => {
        // liste over tider som er bestilt når de blir hentet

        // Formater til samme format som tatteTider bruker: "dato-tid"
        const opptatte = data.tider.map((tid) => `${valgtDato}-${tid}`); // lagen en liste over tider for bestemte datoen som er bestilt
        setTatteTider(opptatte); // oppdaterer dersom tidene er opptatte
      });
  }, [valgtDato]); // brukes forat useEffect skal kjøre på nytt hver gang valgtDato endres

  // Genererer alle tider mellom 10:00 og 18:00 med 15 minutters intervaller
  const alleTider = [];
  for (let time = 10; time < 18; time++) {
    // regner time fra  10:00 til 18:00

    for (let minutt = 0; minutt < 60; minutt += 15) {
      // regner at man kan bestille time basert på hvert 15. minutt

      const tid = `${time}:${minutt === 0 ? "00" : minutt}`; // formaterer at det ikke blir 10:0, men 10:00 f.eks

      alleTider.push(tid); // .push legger til tidene vi har generert i arrayen
    }
  }

  // formulen for stengte dager
  const erStengtDag = () => {
    if (!valgtDato) return false; // hvis ingen av stengte dager er valgt, viser den ikke noe

    const dag = new Date(valgtDato).getDay(); // bruker getday for å gå gjennom alle dager i uken
    return dag === 0 || dag === 1; // 0 = søndag, 1 = mandag, og det returnerer true hvis stengt
  };

  const handleBestill = async () => {
    // funksjon som venter på svar fra backend
    if (!navn || !epost || !tjeneste) {
      // om ingenting er fylt ut
      alert("Fyll ut alle feltene!"); // vises denne meldingen
      return;
    }

    if (!/\S+@\S+\.\S+/.test(epost)) {
      // om eposten ikke er gyldig
      alert("Vennligst oppgi en gyldig e-postadresse!"); // vises denne meldingen
      return;
    }

    const response = await fetch("http://localhost:5000/bestill", {
      // URL til backend-endepunktet
      method: "POST", // metoden
      headers: { "Content-Type": "application/json" }, //  denne er viktig for å fortelle backend at vi sender JSON
      body: JSON.stringify({
        navn,
        epost,
        tjeneste,
        valgtTid: valgtTid,
        valgtDato: valgtDato,
      }), // variabler fra state gjort til json for å kunne sendes til backend
    });
    const result = await response.json(); // svar fra backend
    if (!response.ok) {
      // om responsen ikke er ok
      alert(result.opptatt); // hvis det er en feil, vises denne meldingen
    } else {
      alert("Timen er din!"); // ellers er tiden bestilt
      setTatteTider([...tatteTider, `${valgtDato}-${valgtTid}`]); // legger til den nye bestillingen i listen over tatte tider
      setOpen(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Bestill time!</button>
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
            maxWidth: "550px",
            maxHeight: "85vh",
            overflowY: "auto",
            backgroundColor: "#37383E",
            color: "#CCD7D8",
            padding: "2rem",
            borderRadius: "1.25rem",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
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
              <input
                style={{ padding: "5px", borderRadius: "5px" }}
                type="text"
                placeholder="Fullt navn..."
                onChange={(e) => setNavn(e.target.value)}
                value={navn}
                required
              />
              <input
                style={{ padding: "5px", borderRadius: "5px" }}
                type="text"
                placeholder="Din e-post..."
                onChange={(e) => setEpost(e.target.value)}
                value={epost}
                required
              />
            </div>

            <h3
              style={{
                fontSize: "17px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                padding: "0.5rem 0",
              }}
            >
              Velg tjeneste:
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                padding: "0.5rem 0",
              }}
            >
              {[
                "Herreklipp",
                "Seniorklipp",
                "Barneklipp",
                "Maskinklipp",
                "Barbering",
                "Maskinbarbering",
              ].map((tjeneste, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name="behandling"
                    value={tjeneste}
                    onChange={(e) => setTjeneste(e.target.value)}
                    required
                  />{" "}
                  {tjeneste}
                </label>
              ))}
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "5px",
              }}
            >
              <label>Velg dag:</label>
              <input
                type="date"
                value={valgtDato}
                onChange={(e) => setValgtDato(e.target.value)}
                style={{
                  width: "96%",
                  padding: "10px",
                  margin: "",
                  marginTop: "10px",
                }}
              />

              {erStengtDag() ? (
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Vi holder stengt på søndager og mandager!
                </p>
              ) : (
                <>
                  <label>Velg tid (10:00 - 18:00):</label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {alleTider.map((t) => {
                      // går gjennom alle tider som er generert
                      const denneIDen = `${valgtDato}-${t}`; // lager en unik ID for hver tid basert på dato og tid
                      const erOpptatt = tatteTider.includes(denneIDen); // Sjekker om tiden er i listen vår

                      return (
                        <button
                          type="button"
                          key={t}
                          disabled={erOpptatt} // GJØR AT MAN IKKE KAN TRYKKE
                          onClick={() => setValgtTid(t)} // setter valgt tid
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            // FARGE-LOGIKK:
                            backgroundColor: erOpptatt
                              ? "#999"
                              : valgtTid === t
                                ? "#4CAF50"
                                : "#fff",
                            color:
                              erOpptatt || valgtTid === t ? "white" : "black",
                            cursor: erOpptatt ? "not-allowed" : "pointer",
                            opacity: erOpptatt ? 0.5 : 1,
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
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

export default App;
